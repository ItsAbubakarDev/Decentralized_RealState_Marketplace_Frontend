"use client";

import Link from "next/link";
import { Bell, Wallet, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { ConnectButton } from "thirdweb/react";
import { client } from "../app/client";

export default function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="fixed top-0 z-50 w-full backdrop-blur-md bg-background/70 border-b border-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-primary">
          RealState
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/" className="hover:text-primary transition">Home</Link>
          <Link href="/properties" className="hover:text-primary transition">
            All Properties
          </Link>
          <Link href="/list-property" className="hover:text-primary transition">
            List Property
          </Link>
          <Link href="/contact" className="hover:text-primary transition">
            Contact
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-lg p-2 hover:bg-muted transition"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="flex justify-center ">
                <ConnectButton
                    client={client}
                    appMetadata={{
                      name: "Example App",
                      url: "https://example.com",
                    }}
                />
          </div>

          {/* Notifications */}
          <button className="relative rounded-full p-2 hover:bg-muted transition">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary" />
          </button>

          {/* Profile */}
          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center cursor-pointer">
            <span className="text-sm font-semibold">A</span>
          </div>
        </div>
      </div>
    </header>
  );
}
