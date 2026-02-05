"use client";

import { useState } from "react";
import { client } from "../app/client";
import { polygonAmoy } from "thirdweb/chains";
import { getContract, prepareContractCall } from "thirdweb";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { parseEther } from "ethers";

export default function ListProperty() {
    // ✅ state must be INSIDE component
    const [title, setTitle] = useState("");
    const [propertyAddress, setPropertyAddress] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(""); // string
    const [category, setCategory] = useState("");
    const [image, setImage] = useState("");

    const account = useActiveAccount();
    const { mutate: sendTx, isPending } = useSendTransaction();

    const contract = getContract({
        client,
        chain: polygonAmoy,
        address: "0x77Cf5f9aEf80d5f73d3A31CE4C86fa3aD60AED18",
    });

    const listProperty = () => {
        if (!account) {
            alert("Kindly connect your wallet first");
            return;
        }

        const priceInWei = parseEther(price);

        // ✅ FIXED: Use proper function signature format for thirdweb
        const tx = prepareContractCall({
            contract,
            method: "function listProperty(address, uint256, string, string, string, string, string) returns (uint256)",
            params: [
                account.address,   // owner
                priceInWei,        // price
                title,             // _propertyTitle
                category,          // _category
                propertyAddress,   // _propertyAddress
                description,       // _propertyDescription
                image,             // _image
            ],
        });

        sendTx(tx, {
            onSuccess: () => {
                alert("Property listed successfully");
            },
            onError: (error) => {
                console.error(error);
                alert("Error listing the property");
            },
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 my-12">
            <h2 className="text-3xl font-bold mb-8 text-center text-zinc-900 dark:text-white">List Your Property</h2>
            <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Property Title</label>
                    <input
                        type="text"
                        placeholder="e.g. Luxury Villa in Beverley Hills"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Description</label>
                    <textarea
                        placeholder="Describe your property details..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Price (MATIC)</label>
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
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Category</label>
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
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Property Address</label>
                    <input
                        type="text"
                        placeholder="Full physical address"
                        value={propertyAddress}
                        onChange={(e) => setPropertyAddress(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Image URL</label>
                    <input
                        type="text"
                        placeholder="https://..."
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                    {image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={image}
                            alt="Preview"
                            className="mt-4 w-full h-64 object-cover rounded-xl border border-zinc-200 dark:border-zinc-800"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                    )}
                </div>

                <button
                    onClick={listProperty}
                    disabled={isPending}
                    className="md:col-span-2 mt-4 bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-primary/25"
                >
                    {isPending ? (
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