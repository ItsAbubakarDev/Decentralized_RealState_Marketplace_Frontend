"use client";
import { client } from "../app/client";
import { getContract, readContract, prepareContractCall } from "thirdweb";
import { useSendTransaction, useActiveAccount, MediaRenderer } from "thirdweb/react";
import { useState, useEffect } from "react";
import { polygonAmoy } from "thirdweb/chains";

interface Property {
    propertyID: bigint;
    owner: string;
    price: bigint;
    propertyTitle: string;
    category: string;
    image: string;
    propertyAddress: string;
    description: string;
    reviewers: string[];
    reviews: string[];
}

export default function UpdateProperty({ propertyId }: { propertyId: bigint }) {
    const contract = getContract({
        client,
        chain: polygonAmoy,
        address: "0xA7f4eA9e938f78C95172DDaBDb38712D3147d977"
    });

    const account = useActiveAccount();
    const { mutate: sendTx, isPending } = useSendTransaction();

    const [title, setTitle] = useState("");
    const [propertyAddress, setPropertyAddress] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [isOwner, setIsOwner] = useState(false);

    // Fetch existing property details
    useEffect(() => {
        const fetchPropertyDetails = async () => {
            if (propertyId === undefined || propertyId === null) return;

            setLoading(true);
            try {
                const data = await readContract({
                    contract,
                    method: "function getAllProperty() external view returns((uint256 propertyID, address owner, uint256 price, string propertyTitle, string category, string image, string propertyAddress, string description, address[] reviewers, string[] reviews)[])",
                    params: []
                });

                const property = (data as Property[]).find(p => p.propertyID === propertyId);

                if (property) {
                    setTitle(property.propertyTitle);
                    setPropertyAddress(property.propertyAddress);
                    setDescription(property.description);
                    setCategory(property.category);
                    setImage(property.image);

                    // Check if current user is the owner
                    if (account) {
                        setIsOwner(property.owner.toLowerCase() === account.address.toLowerCase());
                    }
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching property:", err);
                setError(err);
                setLoading(false);
            }
        };

        fetchPropertyDetails();
    }, [propertyId, account]);

    const updatePropertyDetails = async () => {
        if (!account) {
            alert("Please connect your wallet first");
            return;
        }

        if (!isOwner) {
            alert("You are not the owner of this property");
            return;
        }

        if (!title.trim() || !propertyAddress.trim() || !description.trim() || !category.trim() || !image.trim()) {
            alert("All fields are required");
            return;
        }

        try {
            const tx = prepareContractCall({
                contract,
                method: "function updateProperty(address owner, uint256 propertyId, string memory _propertyTitle, string memory _propertyAddress, string memory _propertyDescription, string memory _category, string memory _image) external returns(uint256)",
                params: [
                    account.address,
                    propertyId,
                    title,
                    propertyAddress,
                    description,
                    category,
                    image,
                ]
            });

            sendTx(tx, {
                onSuccess: () => {
                    alert("Property updated successfully!");
                },
                onError: (error) => {
                    console.error("Error updating property:", error);
                    alert("Error updating the property. Please try again.");
                }
            });
        } catch (error) {
            console.error("Error preparing transaction:", error);
            alert("Error preparing transaction. Please try again.");
        }
    };

    if (loading) {
        return (
            <div>
                <p>Loading property details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <p>Error loading property details</p>
            </div>
        );
    }

    if (!account) {
        return (
            <div>
                <p>Please connect your wallet to update property</p>
            </div>
        );
    }

    if (!isOwner) {
        return (
            <div>
                <p>You are not the owner of this property</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Update Property Details</h2>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">Property Title</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter property title"
                        disabled={isPending}
                        className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">Category</label>
                    <div className="relative">
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            disabled={isPending}
                            className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none appearance-none"
                        >
                            <option value="">Select category</option>
                            <option value="House">House</option>
                            <option value="Apartment">Apartment</option>
                            <option value="Villa">Villa</option>
                            <option value="Land">Land</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Office">Office</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="propertyAddress" className="text-sm font-medium">Property Address</label>
                    <input
                        id="propertyAddress"
                        type="text"
                        value={propertyAddress}
                        onChange={(e) => setPropertyAddress(e.target.value)}
                        placeholder="Enter property address"
                        disabled={isPending}
                        className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter property description"
                        rows={4}
                        disabled={isPending}
                        className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none resize-none"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="image" className="text-sm font-medium">Image URL</label>
                    <input
                        id="image"
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="Enter image URL"
                        disabled={isPending}
                        className="w-full px-4 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                    />
                </div>
            </div>

            {image && (
                <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Image Preview</p>
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-border bg-muted">
                        <MediaRenderer
                            client={client}
                            src={image}
                            alt="Property preview"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            )}

            <button
                onClick={updatePropertyDetails}
                disabled={isPending || !isOwner}
                className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-primary/25 mt-4"
            >
                {isPending ? "Updating Property..." : "Save Changes"}
            </button>
        </div>
    );
}