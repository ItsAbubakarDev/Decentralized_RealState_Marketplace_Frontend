import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

const listings = [
    {
        id: 1,
        title: "Luxury Penthouse",
        priceCrypto: "450 ETH",
        priceUSD: "$1,200,000",
        location: "Downtown, Dubai",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000",
    },
    {
        id: 2,
        title: "Modern Beach Villa",
        priceCrypto: "850 ETH",
        priceUSD: "$2,500,000",
        location: "Miami, FL",
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1000",
    },
    {
        id: 3,
        title: "Crypto Valley Apt",
        priceCrypto: "120 ETH",
        priceUSD: "$350,000",
        location: "Zug, Switzerland",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000",
    },
];

const FeaturedListings = () => {
    return (
        <section className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Listings</h2>
                        <p className="text-muted-foreground">Discover the most exclusive properties on chain.</p>
                    </div>
                    <Link href="/properties" className="hidden md:inline-flex text-primary hover:text-orange-500 font-medium items-center gap-2 transition-colors">
                        View All Properties &rarr;
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {listings.map((item) => (
                        <div
                            key={item.id}
                            className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-2"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10">
                                    Verified
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>

                                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                                    <MapPin size={16} className="text-primary" />
                                    {item.location}
                                </div>

                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Price</p>
                                        <p className="font-bold text-lg">{item.priceCrypto}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">USD Est.</p>
                                        <p className="text-sm font-medium">{item.priceUSD}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link href="/properties" className="text-primary hover:text-orange-500 font-medium inline-flex items-center gap-2 transition-colors">
                        View All Properties &rarr;
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedListings;
