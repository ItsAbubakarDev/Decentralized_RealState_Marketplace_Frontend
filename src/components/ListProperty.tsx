"use client";

import { useState } from "react";
import { client } from "../app/client";
import { polygonAmoy } from "thirdweb/chains";
import { getContract, prepareContractCall } from "thirdweb";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { parseEther } from "ethers";
import { upload } from "thirdweb/storage"; // ✅ Use this instead

export default function ListProperty() {
    const [title, setTitle] = useState("");
    const [propertyAddress, setPropertyAddress] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [isUploadingToIPFS, setIsUploadingToIPFS] = useState(false);

    const account = useActiveAccount();
    const { mutate: sendTx, isPending } = useSendTransaction();

    const contract = getContract({
        client,
        chain: polygonAmoy,
        address: "0xA7f4eA9e938f78C95172DDaBDb38712D3147d977",
    });

    // ✅ Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert('File size should be less than 5MB');
                return;
            }

            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    // ✅ FIXED: Upload to IPFS using SDK v5
    const uploadToIPFS = async (file: File): Promise<string> => {
        try {
            console.log("Uploading to IPFS...");

            // Upload using the client from your config
            const uri = await upload({
                client,
                files: [file],
            });

            console.log("IPFS URI:", uri);
            return uri; // Returns: ipfs://QmXxxx...
        } catch (error) {
            console.error("IPFS upload error:", error);
            throw new Error("Failed to upload image to IPFS");
        }
    };

    const listProperty = async () => {
        if (!account) {
            alert("Kindly connect your wallet first");
            return;
        }

        if (!title || !propertyAddress || !description || !price || !category || !imageFile) {
            alert("Please fill all fields and select an image");
            return;
        }

        try {
            // Step 1: Upload image to IPFS
            setIsUploadingToIPFS(true);
            const ipfsUri = await uploadToIPFS(imageFile);
            setIsUploadingToIPFS(false);

            console.log("Image uploaded to IPFS:", ipfsUri);

            // Step 2: Prepare transaction
            const priceInWei = parseEther(price);

            const tx = prepareContractCall({
                contract,
                method: "function listProperty(address, uint256, string, string, string, string, string) returns (uint256)",
                params: [
                    account.address,
                    priceInWei,
                    title,
                    category,
                    propertyAddress,
                    description,
                    ipfsUri,
                ],
            });

            // Step 3: Send transaction
            sendTx(tx, {
                onSuccess: () => {
                    alert("Property listed successfully!");
                    setTitle("");
                    setPropertyAddress("");
                    setDescription("");
                    setPrice("");
                    setCategory("");
                    setImageFile(null);
                    setImagePreview("");
                },
                onError: (error) => {
                    console.error(error);
                    alert("Error listing the property");
                },
            });

        } catch (error) {
            setIsUploadingToIPFS(false);
            console.error("Error:", error);
            alert(error instanceof Error ? error.message : "An error occurred");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 my-12">
            <h2 className="text-3xl font-bold mb-8 text-center text-zinc-900 dark:text-white">
                List Your Property
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Property Title
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Luxury Villa in Beverley Hills"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Description
                    </label>
                    <textarea
                        placeholder="Describe your property details..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Price (MATIC)
                    </label>
                    <input
                        type="number"
                        placeholder="0.0"
                        step="0.0001"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Category
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    >
                        <option value="">Select Category</option>
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Industrial">Industrial</option>
                        <option value="Land">Land</option>
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Property Address
                    </label>
                    <input
                        type="text"
                        placeholder="Full physical address"
                        value={propertyAddress}
                        onChange={(e) => setPropertyAddress(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Property Image
                    </label>
                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-zinc-300 dark:border-zinc-700 border-dashed rounded-xl cursor-pointer bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg
                                    className="w-8 h-8 mb-3 text-zinc-500 dark:text-zinc-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 16"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                    />
                                </svg>
                                <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    PNG, JPG, GIF (MAX. 5MB)
                                </p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>

                    {imagePreview && (
                        <div className="mt-4 relative">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-64 object-cover rounded-xl border border-zinc-200 dark:border-zinc-800"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setImageFile(null);
                                    setImagePreview("");
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                            {imageFile && (
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                                    Selected: {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <button
                    onClick={listProperty}
                    disabled={isPending || isUploadingToIPFS}
                    className="md:col-span-2 mt-4 bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-primary/25"
                >
                    {isUploadingToIPFS ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                            Uploading to IPFS...
                        </span>
                    ) : isPending ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                            Listing Property...
                        </span>
                    ) : (
                        "List Property"
                    )}
                </button>
            </div>
        </div>
    );
}