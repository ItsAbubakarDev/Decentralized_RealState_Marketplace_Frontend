"use client";
import { client } from "@/app/client";
import { ConnectButton } from "thirdweb/react";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center bg-background overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/40 z-10" />
        <Image
          src="/herosecionbackgroundremoved.png"
          alt="Real Estate Background"
          fill
          className="object-cover object-right opacity-80"
          priority
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight">
            Buy Real Estate on the <span className="text-primary">Blockchain</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
            Experience the future of property ownership. Secure, transparent, and instant transactions powered by blockchain technology.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/properties"
              className="bg-primary hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
            >
              Explore Properties
            </Link>

            <ConnectButton
              client={client}
              appMetadata={{
                name: "Real State Marketplace",
                url: "sugarrealstate.com"
              }

              }
            >

            </ConnectButton>
          </div>

          <div className="mt-12 flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Instant Settlement
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-75" />
              Low Fees
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150" />
              Global Access
            </div>
          </div>
        </div>
      </div>
    </section >
  );
};

export default Hero;
