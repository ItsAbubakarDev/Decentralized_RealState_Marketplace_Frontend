"use client";
import { getContract, prepareContractCall } from "thirdweb";
import { polygonAmoy } from "thirdweb/chains";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { client } from "../app/client";
import { useState } from "react";
import { Wallet, Loader2, CheckCircle2 } from "lucide-react";

export default function BuyProperty({ propertyId, price, owner }: { propertyId: bigint, price: bigint, owner: string }) {
    const [isBuying, setIsBuying] = useState(false);

    const account = useActiveAccount();
    const { mutate: sendTx, isPending } = useSendTransaction();

    const contract = getContract({
        client,
        chain: polygonAmoy,
        address: "0x77Cf5f9aEf80d5f73d3A31CE4C86fa3aD60AED18"
    });

    const isOwner = account?.address.toLowerCase() === owner.toLowerCase();

    const buyProperty = async () => {
        if (!account) {
            alert("Please connect your wallet first");
            return;
        }

        if (isOwner) {
            alert("You cannot buy your own property");
            return;
        }

        setIsBuying(true);

        try {
            const tx = prepareContractCall({
                contract,
                method: "function buyProperty(uint256 propertyId, address buyer) external payable",
                params: [
                    propertyId,
                    account.address
                ],
                value: price,
            });

            sendTx(tx, {
                onSuccess: () => {
                    alert("Property bought successfully! You can view the ownership in your profile section.");
                    setIsBuying(false);
                },
                onError: (error) => {
                    console.error("Error buying property:", error);
                    alert("Error buying property. Please try again.");
                    setIsBuying(false);
                }
            });
        } catch (error) {
            console.error("Error preparing transaction:", error);
            alert("Error preparing transaction. Please try again.");
            setIsBuying(false);
        }
    };

    return (
        <div className="bg-card p-6 border border-border rounded-xl">
            <div className="flex justify-between items-center mb-6">
                <span className="font-medium text-muted-foreground">Current Price</span>
                <span className="text-2xl font-bold text-primary">{(Number(price) / 1e18).toFixed(4)} MATIC</span>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg mb-6 text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                <p>Verify the price and details before proceeding. A standard blockchain network fee applies.</p>
            </div>

            {!account ? (
                <div className="text-center p-4 bg-muted/20 rounded-lg text-sm text-muted-foreground">
                    Connect your wallet to purchase this property
                </div>
            ) : isOwner ? (
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/10 text-yellow-700 dark:text-yellow-400 rounded-lg font-medium border border-yellow-200 dark:border-yellow-900/30">
                    You own this property
                </div>
            ) : (
                <button
                    onClick={buyProperty}
                    disabled={isPending || isBuying || !account}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2 group"
                >
                    {isPending || isBuying ? (
                        <>
                            <Loader2 className="animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Wallet className="group-hover:scale-110 transition-transform" />
                            Buy Property Now
                        </>
                    )}
                </button>
            )}
        </div>
    );
}