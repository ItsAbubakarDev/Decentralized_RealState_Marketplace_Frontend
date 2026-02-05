"use client";
import { client } from "../app/client";
import { getContract, prepareContractCall } from "thirdweb";
import { polygonAmoy } from "thirdweb/chains";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { ThumbsUp } from "lucide-react";

interface LikeReviewProps {
    propertyId: bigint;
    reviewId: bigint;
}

export default function LikeReview({ propertyId, reviewId }: LikeReviewProps) {
    const account = useActiveAccount();
    const { mutate: sendTx, isPending } = useSendTransaction();

    const contract = getContract({
        client,
        chain: polygonAmoy,
        address: "0x77Cf5f9aEf80d5f73d3A31CE4C86fa3aD60AED18"
    });

    const likeReview = async () => {
        if (!account) {
            alert("Please connect your wallet first");
            return;
        }

        try {
            const tx = prepareContractCall({
                contract,
                method: "function likeReview(uint256 propertyId, uint256 reviewId, address liker) external",
                params: [
                    propertyId,
                    reviewId,
                    account.address
                ]
            });

            sendTx(tx, {
                onSuccess: () => {
                    alert("Review liked successfully!");
                },
                onError: (error) => {
                    console.error("Error liking review:", error);
                    alert("Error liking the review, please try again");
                }
            });
        } catch (error) {
            console.error("Error preparing transaction:", error);
            alert("Error liking the review, please try again");
        }
    };

    return (
        <button
            onClick={likeReview}
            disabled={isPending || !account}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mt-2"
            title={!account ? "Connect wallet to like" : "Like this review"}
        >
            <ThumbsUp size={16} className={isPending ? "animate-pulse" : ""} />
            <span>{isPending ? "Liking..." : "Like"}</span>
        </button>
    );
}