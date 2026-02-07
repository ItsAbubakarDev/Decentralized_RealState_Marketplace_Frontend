"use client";
import { useState } from "react";
import { getContract, prepareContractCall } from "thirdweb";
import { client } from "../app/client";
import { polygonAmoy } from "thirdweb/chains";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { Star } from "lucide-react";

export default function AddReview({ propertyId }: { propertyId: bigint }) {
    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [reviewComment, setReviewComment] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const account = useActiveAccount();
    const { mutate: sendTx, isPending } = useSendTransaction();

    const contract = getContract({
        client,
        chain: polygonAmoy,
        address: "0xA7f4eA9e938f78C95172DDaBDb38712D3147d977",
    });

    const submitReview = async () => {
        if (!account) {
            alert("Please connect your wallet first");
            return;
        }

        if (rating === 0) {
            alert("Please select a rating");
            return;
        }

        if (!reviewComment || reviewComment.trim() === "") {
            alert("Review comment is required");
            return;
        }

        setIsSubmitting(true);

        try {
            const tx = prepareContractCall({
                contract,
                method: "function addReview(uint256 propertyId, uint256 rating, string calldata comment, address reviewer) external",
                params: [
                    propertyId,
                    BigInt(rating),
                    reviewComment,
                    account.address
                ],
            });

            sendTx(tx, {
                onSuccess: () => {
                    alert("Review submitted successfully!");
                    setRating(0);
                    setReviewComment("");
                    setIsSubmitting(false);
                },
                onError: (error) => {
                    console.error("Error submitting review:", error);
                    alert("Error submitting review. Please try again.");
                    setIsSubmitting(false);
                },
            });
        } catch (error) {
            console.error("Error preparing transaction:", error);
            alert("Error preparing transaction");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Write a Review</h3>

            {!account ? (
                <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-xl">
                    <p>Please connect your wallet to submit a review</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Rating</label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <Star
                                        size={28}
                                        fill={(hoverRating || rating) >= star ? "#eab308" : "transparent"}
                                        className={(hoverRating || rating) >= star ? "text-yellow-500" : "text-muted-foreground/30"}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="reviewComment" className="block text-sm font-medium mb-2">Your Review</label>
                        <textarea
                            id="reviewComment"
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Share your experience with this property..."
                            rows={4}
                            className="w-full bg-background border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
                            disabled={isPending || isSubmitting}
                        />
                    </div>

                    <button
                        onClick={submitReview}
                        disabled={isPending || isSubmitting}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isPending || isSubmitting ? (
                            <>
                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                Submitting...
                            </>
                        ) : (
                            "Submit Review"
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}