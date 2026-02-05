"use client";
import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { Copy, Check, User as UserIcon, Wallet, Building2, MessageSquare } from "lucide-react";
import GetUserProperties from "./GetUserProperties";
import GetUserReviews from "./GetUserReviews";

export default function UserProfile() {
    const account = useActiveAccount();
    const [activeTab, setActiveTab] = useState<"properties" | "reviews">("properties");
    const [copied, setCopied] = useState(false);

    const copyAddress = () => {
        if (account?.address) {
            navigator.clipboard.writeText(account.address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const formatAddress = (addr: string) => {
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    };

    if (!account) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <Wallet className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Wallet Not Connected</h2>
                <p className="text-muted-foreground max-w-md">
                    Please connect your wallet to access your profile, view your listed properties, and manage your reviews.
                </p>
                {/* Note: The ConnectButton from thirdweb usually handles the connection, 
                    so we assume it's in the Navbar. We just show a message here. */}
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* 1️⃣ Profile Header */}
            <div className="bg-card rounded-2xl p-8 border border-border shadow-sm mb-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-orange-400"></div>

                {/* Avatar */}
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-orange-500 to-yellow-500 p-1 shadow-xl">
                        <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                            {/* Colorful geometric placeholder based on address would go here or just a nice icon */}
                            <UserIcon className="w-10 h-10 text-primary" />
                        </div>
                    </div>
                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background" title="Connected"></div>
                </div>

                {/* Identity Info */}
                <div className="text-center md:text-left flex-grow">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            Welcome Back
                        </h1>
                    </div>

                    <div className="flex items-center justify-center md:justify-start gap-3 bg-muted/50 py-1.5 px-3 rounded-full w-fit mx-auto md:mx-0 border border-border/50">
                        <span className="font-mono text-sm font-medium text-foreground/80">
                            {formatAddress(account.address)}
                        </span>
                        <button
                            onClick={copyAddress}
                            className="text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                            title="Copy Address"
                        >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* 2️⃣ Tabs Navigation */}
            <div className="mb-8">
                <div className="flex items-center gap-1 border-b border-border/60">
                    <button
                        onClick={() => setActiveTab("properties")}
                        className={`
                            group flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all relative
                            ${activeTab === "properties" ? "text-primary" : "text-muted-foreground hover:text-foreground"}
                        `}
                    >
                        <Building2 className={`w-4 h-4 ${activeTab === "properties" ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                        My Properties
                        {activeTab === "properties" && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab("reviews")}
                        className={`
                            group flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all relative
                            ${activeTab === "reviews" ? "text-primary" : "text-muted-foreground hover:text-foreground"}
                        `}
                    >
                        <MessageSquare className={`w-4 h-4 ${activeTab === "reviews" ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                        My Reviews
                        {activeTab === "reviews" && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>
                        )}
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === "properties" ? (
                    <GetUserProperties />
                ) : (
                    <div className="max-w-3xl">
                        <GetUserReviews />
                    </div>
                )}
            </div>
        </div>
    );
}
