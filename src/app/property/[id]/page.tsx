"use client";

import { client } from "../../client";
import { polygonAmoy } from "thirdweb/chains";
import { getContract, readContract } from "thirdweb";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AddReview from "../../../components/addReview";
import LikeReview from "../../../components/LikeReview";
import { Star, MapPin, User, Tag } from "lucide-react";
import BuyProperty from "../../../components/BuyProperty";

// Define the Property type based on your smart contract
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

const contract = getContract({
    client,
    chain: polygonAmoy,
    address: "0x77Cf5f9aEf80d5f73d3A31CE4C86fa3aD60AED18",
});


export default function PropertyDetailsPage() {
    const params = useParams();
    const id = params.id as string;

    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const fetchProperty = async () => {
        if (!id) return;

        setLoading(true);
        try {
            // Since there isn't a getPropertyById function in the ABI snippet I saw earlier, 
            // I will fetch all and find the one matching the ID.
            // Ideally, the contract should have a getProperty(uint256 id) function.
            const data = await readContract({
                contract,
                method: "function getAllProperty() external view returns((uint256 propertyID, address owner, uint256 price, string propertyTitle, string category, string image, string propertyAddress, string description, address[] reviewers, string[] reviews)[])",
                params: []
            });

            const foundProperty = (data as Property[]).find(p => p.propertyID.toString() === id);

            if (foundProperty) {
                setProperty(foundProperty);
            } else {
                setError(new Error("Property not found"));
            }
        }
        catch (err) {
            setError(err);
            console.error("Error fetching property:", err);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProperty();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[60vh] text-center">
                <h1 className="text-3xl font-bold mb-4">Property Not Found</h1>
                <p className="text-muted-foreground mb-6">The property you are looking for does not exist.</p>
                <div className="flex gap-4">
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={() => window.location.href = '/properties'}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                    >
                        Browse All
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <button
                onClick={() => window.history.back()}
                className="mb-8 text-sm text-muted-foreground hover:text-primary transition flex items-center gap-1"
            >
                ← Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column: Image */}
                <div>
                    <div className="rounded-2xl overflow-hidden shadow-lg border border-border/50 aspect-video lg:aspect-square relative">
                        <img
                            src={property.image}
                            alt={property.propertyTitle}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.src = "https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&w=800&q=80";
                            }}
                        />
                        <div className="absolute top-4 right-4 bg-primary text-white px-4 py-1.5 rounded-full font-bold shadow-lg">
                            {(Number(property.price) / 1e18).toFixed(4)} MATIC
                        </div>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide flex items-center gap-1">
                            <Tag size={12} /> {property.category}
                        </span>
                    </div>

                    <h1 className="text-4xl font-bold mb-6">{property.propertyTitle}</h1>

                    <div className="space-y-4 mb-8 text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <MapPin className="text-primary" size={20} />
                            <span className="text-lg">{property.propertyAddress}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="text-primary" size={20} />
                            <span className="font-mono bg-muted/50 px-2 py-0.5 rounded text-sm">
                                {property.owner}
                            </span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-3">About this property</h3>
                        <p className="leading-relaxed text-lg opacity-90">{property.description}</p>
                    </div>

                    <div className="mb-12">
                        <BuyProperty propertyId={BigInt(id)} price={property.price} owner={property.owner} />
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-16 pt-16 border-t border-border">
                <h2 className="text-3xl font-bold mb-8">Reviews</h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Add Review Form */}
                    <div className="lg:col-span-1">
                        <AddReview propertyId={BigInt(id)} />
                    </div>

                    {/* Review List */}
                    <div className="lg:col-span-2">
                        {property.reviews.length === 0 ? (
                            <div className="text-center py-12 bg-muted/10 rounded-2xl border border-dashed border-border text-muted-foreground">
                                <p>No reviews yet. Be the first to share your experience!</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {property.reviews.map((review, index) => (
                                    <div key={index} className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
                                        {/* 
                                            Since the contract structure shown for review seems to be just a string 'reviews[]', 
                                            I assume the rating is not returned in the getAllProperty struct or it's formatted in the string.
                                            However, the addReview function takes rating. 
                                            Assuming existing display logic, or just displaying the text comment.
                                            
                                            If the contract returns reviewer address in 'reviewers[]' and comment in 'reviews[]',
                                            we can map them by index if they are parallel arrays.
                                        */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                                    {property.reviewers[index]?.slice(2, 4)}
                                                </div>
                                                <span className="font-mono text-xs opacity-70">
                                                    {property.reviewers[index]}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-lg opacity-90">{review}</p>
                                        <div className="mt-4 pt-4 border-t border-border/30">
                                            <LikeReview propertyId={BigInt(id)} reviewId={BigInt(index)} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
