"use client";

import Header from "../components/Header";
import Hero from "../components/Hero";
import FeaturedListings from "../components/FeaturedListings";
import HowItWorks from "../components/HowItWorks";
import Benefits from "../components/Benefits";
import CallToAction from "../components/CallToAction";

export default function Home() {
  return (
    <main className="bg-background min-h-screen text-foreground selection:bg-primary selection:text-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Featured Listings */}
      <FeaturedListings />

      {/* How It Works */}
      <HowItWorks />

      {/* Benefits */}
      <Benefits />

      {/* Call To Action */}
      <CallToAction />
    </main>
  );
}
