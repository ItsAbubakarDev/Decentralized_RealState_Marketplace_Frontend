"use client";

import { client } from "../app/client";
import { polygonAmoy } from "thirdweb/chains";
import { getContract, readContract } from "thirdweb";
import { useState, useEffect } from "react";

// Define the Property type based on your smart contract
interface Property {
    propertyID: bigint;
    owner: string;
    price: bigint;
    propertyTitle: string;
    category: string;
    image: string;
    propertyAddress: string;
    description: string;
    reviewers: string[];
    reviews: string[];
}

const contract = getContract({
    client,
    chain: polygonAmoy,
    address: "0x77Cf5f9aEf80d5f73d3A31CE4C86fa3aD60AED18",
})

export default function DisplayAllProperties() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
    const [filterCategory, setFilterCategory] = useState("");

    const fetchProperties = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await readContract({
                contract,
                method: "function getAllProperty() external view returns((uint256 propertyID, address owner, uint256 price, string propertyTitle, string category, string image, string propertyAddress, string description, address[] reviewers, string[] reviews)[])",
                params: []
            });
            setProperties(data as Property[]);
            setFilteredProperties(data as Property[]);
        }
        catch (err) {
            setError(err);
            console.error("Error fetching properties:", err);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProperties();
    }, []);

    const filterByCategory = (category: string) => {
        setFilterCategory(category);
        if (category === "") {
            setFilteredProperties(properties);
        } else {
            const filtered = properties.filter((property) => property.category === category);
            setFilteredProperties(filtered);
        }
    }

    // Get unique categories from all properties
    const categories = Array.from(new Set(properties.map(p => p.category)));

    if (loading) {
        return (
            <div>
                <h2>Loading properties...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h2>Error loading properties</h2>
                <p>{error.message || "An error occurred"}</p>
                <button onClick={fetchProperties}>Retry</button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Discover Properties
                </h1>

                {/* Filter Section */}
                <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm p-2 rounded-lg border border-border">
                    <label htmlFor="category-filter" className="font-medium px-2">Filter:</label>
                    <select
                        id="category-filter"
                        value={filterCategory}
                        onChange={(e) => filterByCategory(e.target.value)}
                        className="bg-transparent border-none outline-none focus:ring-0 cursor-pointer min-w-[150px]"
                    >
                        <option value="">All Categories</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Properties Display */}
            <div className="min-h-[400px]">
                {filteredProperties.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-10 text-center text-muted-foreground">
                        <p className="text-xl">No properties found</p>
                        <button
                            onClick={() => setFilterCategory("")}
                            className="mt-4 text-primary hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProperties.map((property) => (
                            <div
                                key={property.propertyID.toString()}
                                className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300 flex flex-col"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img
                                        src={property.image}
                                        alt={property.propertyTitle}
                                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => {
                                            e.currentTarget.src = "https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&w=800&q=80";
                                        }}
                                    />
                                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">
                                        {property.category}
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold line-clamp-1">{property.propertyTitle}</h3>
                                    </div>

                                    <p className="text-2xl font-bold text-primary mb-4">
                                        {(Number(property.price) / 1e18).toFixed(4)} MATIC
                                    </p>

                                    <div className="space-y-2 text-sm text-muted-foreground mb-6 flex-grow">
                                        <p className="flex items-center gap-2">
                                            <span className="opacity-70">📍</span>
                                            <span className="truncate">{property.propertyAddress}</span>
                                        </p>
                                        <p className="line-clamp-2">{property.description}</p>
                                    </div>

                                    <div className="pt-4 border-t border-border mt-auto">
                                        <button
                                            onClick={() => {
                                                window.location.href = `/property/${property.propertyID}`;
                                            }}
                                            className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-white py-3 rounded-xl font-semibold transition-all duration-300"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Refresh Button */}
            <div className="flex justify-center mt-12">
                <button
                    onClick={fetchProperties}
                    className="px-6 py-2 rounded-full border border-border hover:bg-muted transition-colors text-sm font-medium"
                >
                    Refresh Properties
                </button>
            </div>
        </div>
    );
}