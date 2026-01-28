"use client";

import Image from "next/image";
import thirdwebIcon from "@public/thirdweb.svg";
import { ConnectButton } from "thirdweb/react";
import { client } from "./client";
import Hero from "../components/Hero";

export default function Home() {
  return (
    <main className="bg-gradient-to-b from-[#0D0D0D] to-[#111111] text-white min-h-screen">
      {/* Header */}
      <Header />

      {/* Connect Button */}
      <div className="flex justify-center my-10">
        <ConnectButton
          client={client}
          appMetadata={{
            name: "Example App",
            url: "https://example.com",
          }}
        />
      </div>

      {/* Thirdweb Resources */}
      <ThirdwebResources />

      {/* Hero Section */}
      <Hero />
    </main>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center py-12">
      <Image
        src={thirdwebIcon}
        alt="thirdweb logo"
        width={150}
        height={150}
        className="drop-shadow-[0_0_24px_#a726a9a8]"
      />

      <h1 className="text-3xl md:text-6xl font-bold tracking-tighter mt-4 text-zinc-100 text-center">
        thirdweb SDK
        <span className="text-zinc-300 mx-1"> + </span>
        <span className="-skew-x-6 text-blue-500">Next.js</span>
      </h1>

      <p className="text-zinc-300 text-base mt-2 text-center">
        Read the{" "}
        <code className="bg-zinc-800 text-zinc-300 px-2 rounded py-1 text-sm mx-1">
          README.md
        </code>{" "}
        file to get started.
      </p>
    </header>
  );
}

function ThirdwebResources() {
  return (
    <div className="grid gap-6 lg:grid-cols-3 justify-center max-w-7xl mx-auto px-4 mb-20">
      <ArticleCard
        title="thirdweb SDK Docs"
        href="https://portal.thirdweb.com/typescript/v5"
        description="thirdweb TypeScript SDK documentation"
      />
      <ArticleCard
        title="Components and Hooks"
        href="https://portal.thirdweb.com/typescript/v5/react"
        description="Learn about the thirdweb React components and hooks in thirdweb SDK"
      />
      <ArticleCard
        title="thirdweb Dashboard"
        href="https://thirdweb.com/dashboard"
        description="Deploy, configure, and manage your smart contracts from the dashboard."
      />
    </div>
  );
}

function ArticleCard({ title, href, description }: { title: string; href: string; description: string; }) {
  return (
    <a
      href={href + "?utm_source=next-template"}
      target="_blank"
      className="flex flex-col border border-zinc-800 p-4 rounded-lg hover:bg-zinc-900 transition-colors hover:border-zinc-700"
      rel="noreferrer"
    >
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-sm text-zinc-400">{description}</p>
    </a>
  );
}
