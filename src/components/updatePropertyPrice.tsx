"use client";
import { client } from "../app/client";
import { getContract, readContract, prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { useState, useEffect } from "react";
import { polygonAmoy } from "thirdweb/chains";
import { useActiveAccount } from "thirdweb/react";

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

export default function UpdatePropertyPrice({ propertyId }: { propertyId: bigint }) {
    const contract = getContract({
        client,
        chain: polygonAmoy,
        address: "0xA7f4eA9e938f78C95172DDaBDb38712D3147d977"
    });

    const account = useActiveAccount();
    const { mutate: sendTx, isPending } = useSendTransaction();

    const [newPrice, setNewPrice] = useState("");
    const [currentPrice, setCurrentPrice] = useState<bigint>(BigInt(0));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [isOwner, setIsOwner] = useState(false);
    const [propertyTitle, setPropertyTitle] = useState("");

    // Fetch current property details
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
                    setCurrentPrice(property.price);
                    setPropertyTitle(property.propertyTitle);

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

    const updatePrice = async () => {
        if (!account) {
            alert("Please connect your wallet first");
            return;
        }

        if (!isOwner) {
            alert("You are not the owner of this property");
            return;
        }

        if (!newPrice || newPrice.trim() === "") {
            alert("Please enter a new price");
            return;
        }

        const priceValue = parseFloat(newPrice);
        if (priceValue <= 0) {
            alert("Price must be greater than zero");
            return;
        }

        try {
            // Convert price from MATIC to Wei (multiply by 10^18)
            const priceInWei = BigInt(Math.floor(priceValue * 1e18));

            const tx = prepareContractCall({
                contract,
                method: "function updatePriceOfProperty(address owner, uint256 propertyId, uint256 newPrice) external returns(string memory)",
                params: [
                    account.address,
                    propertyId,
                    priceInWei,
                ]
            });

            sendTx(tx, {
                onSuccess: () => {
                    alert("Property price updated successfully!");
                    setCurrentPrice(priceInWei);
                    setNewPrice("");
                },
                onError: (error) => {
                    console.error("Error updating price:", error);
                    alert("Error updating the price. Please try again.");
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
                <p>Please connect your wallet to update property price</p>
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
            <h2 className="text-2xl font-bold mb-6">Update Price</h2>

            <div className="bg-muted/50 p-4 rounded-xl border border-border">
                <p className="text-sm text-muted-foreground mb-1">Property</p>
                <p className="font-semibold text-lg">{propertyTitle}</p>

                <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Current Price</span>
                    <span className="font-bold text-primary text-lg">{(Number(currentPrice) / 1e18).toFixed(4)} MATIC</span>
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="newPrice" className="text-sm font-medium">New Price (in MATIC)</label>
                <div className="relative">
                    <input
                        id="newPrice"
                        type="number"
                        step="0.0001"
                        min="0"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        placeholder="0.0000"
                        disabled={isPending}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none font-mono text-lg"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                        MATIC
                    </div>
                </div>
            </div>

            {newPrice && parseFloat(newPrice) > 0 && (
                <div className="p-3 bg-primary/10 rounded-lg text-sm text-primary font-medium flex items-center justify-between">
                    <span>New Listing Price</span>
                    <span>{parseFloat(newPrice).toFixed(4)} MATIC</span>
                </div>
            )}

            <button
                onClick={updatePrice}
                disabled={isPending || !isOwner || !newPrice}
                className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-primary/25 mt-2"
            >
                {isPending ? "Updating Price..." : "Update Price"}
            </button>
        </div>
    );
}