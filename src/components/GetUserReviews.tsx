"use client";
import { client } from "../app/client";
import { useState, useEffect } from "react";
import { polygonAmoy } from "thirdweb/chains";
import { getContract, readContract } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { Star, ThumbsUp, ExternalLink, MessageSquare } from "lucide-react";
import Link from "next/link";

interface Review {
    reviewer: string;
    productId: bigint;
    rating: number;
    comment: string;
    likes: bigint;
}

interface Property {
    propertyID: bigint;
    propertyTitle: string;
}

const contract = getContract({
    client,
    chain: polygonAmoy,
    address: "0xA7f4eA9e938f78C95172DDaBDb38712D3147d977"
});

export default function GetUserReviews() {
    const account = useActiveAccount();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [propertyTitles, setPropertyTitles] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchUserReviews = async () => {
        if (!account) return;

        setLoading(true);
        setError(null);

        try {
            // Fetch reviews
            const reviewsData = await readContract({
                contract,
                method: "function getUserReviews(address user) external view returns ((address reviewer, uint256 productId, uint8 rating, string comment, uint256 likes)[])",
                params: [account.address],
            }) as Review[];

            // Deduplicate reviews based on productId + comment + rating
            const uniqueReviews = reviewsData.filter((review, index, self) =>
                index === self.findIndex((r) => (
                    r.productId === review.productId &&
                    r.comment === review.comment &&
                    r.rating === review.rating
                ))
            );

            setReviews(uniqueReviews);

            // Fetch all properties to get titles
            if (uniqueReviews.length > 0) {
                const propertiesData = await readContract({
                    contract,
                    method: "function getAllProperty() external view returns((uint256 propertyID, address owner, uint256 price, string propertyTitle, string category, string image, string propertyAddress, string description, address[] reviewers, string[] reviews)[])",
                    params: []
                }) as any[];

                // Create a map of ID -> Title
                const titleMap: Record<string, string> = {};
                propertiesData.forEach((p) => {
                    titleMap[p.propertyID.toString()] = p.propertyTitle;
                });
                setPropertyTitles(titleMap);
            }
        } catch (err) {
            console.error("Error fetching user reviews:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (account) {
            fetchUserReviews();
        }
    }, [account]);

    if (!account) return null;

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500 mb-4">Error loading reviews</p>
                <button
                    onClick={fetchUserReviews}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="w-full">
            {reviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-muted/30 rounded-2xl border border-dashed border-border text-center">
                    <div className="bg-muted p-4 rounded-full mb-4">
                        <MessageSquare className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">No reviews yet</h3>
                    <p className="text-muted-foreground mt-1 max-w-sm">
                        You haven't written any reviews yet.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review, index) => {
                        const title = propertyTitles[review.productId.toString()] || `Property #${review.productId.toString()}`;

                        return (
                            <div
                                key={`${review.productId.toString()}-${index}`}
                                className="bg-card rounded-xl p-6 border border-border/60 hover:border-primary/30 hover:shadow-md transition-all duration-300"
                            >
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="flex-grow space-y-3">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <Link
                                                href={`/property/${review.productId}`}
                                                className="font-bold text-lg hover:text-primary transition-colors flex items-center gap-1"
                                            >
                                                {title}
                                                <ExternalLink className="w-3 h-3 opacity-50" />
                                            </Link>
                                            <div className="flex items-center text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                                                {Array.from({ length: 5 }, (_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-3.5 h-3.5 ${i < review.rating ? "fill-current" : "text-muted-foreground/30 fill-none"}`}
                                                    />
                                                ))}
                                                <span className="ml-1.5 text-xs font-semibold">{review.rating}/5</span>
                                            </div>
                                        </div>

                                        <p className="text-foreground/90 leading-relaxed text-sm md:text-base">
                                            "{review.comment}"
                                        </p>

                                        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                                            <div className="flex items-center gap-1.5">
                                                <ThumbsUp className="w-4 h-4 text-primary" />
                                                <span className="font-medium text-foreground">{review.likes.toString()}</span> likes
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}