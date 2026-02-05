"use client";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/app/client";
import Link from "next/link";

const CallToAction = () => {
    return (
        <section className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="rounded-3xl bg-card dark:bg-gradient-to-r dark:from-zinc-900 dark:via-zinc-900 dark:to-black border border-border p-8 md:p-16 text-center relative overflow-hidden shadow-2xl">

                    {/* Decorative Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-primary/20 blur-[100px] rounded-full -z-1" />

                    <h2 className="text-4xl md:text-5xl font-bold mb-6 max-w-3xl mx-auto">
                        Ready to Start Your Journey?
                    </h2>

                    <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                        Join thousands of users buying and selling real estate on the blockchain. Secure, fast, and transparent.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/properties"
                            className="bg-primary hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-primary/25 min-w-[200px]"
                        >
                            Explore Properties
                        </Link>

                        <div className="min-w-[200px]">
                            <ConnectButton
                                client={client}
                                appMetadata={{
                                    name: "Real State Poject",
                                    url: "https://realstate.com",
                                }}
                            />
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
