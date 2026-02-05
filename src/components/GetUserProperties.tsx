"use client";
import { client } from "../app/client";
import { useActiveAccount } from "thirdweb/react";
import { useState, useEffect } from "react";
import { getContract, readContract } from "thirdweb";
import { polygonAmoy } from "thirdweb/chains";
import { MapPin, Tag, ArrowRight, Home } from "lucide-react";
import Link from "next/link";

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

import UpdateProperty from "./UpdateProperty";
import UpdatePropertyPrice from "./updatePropertyPrice";
import { Edit, DollarSign, X } from "lucide-react";

// ... existing imports

export default function GetUserProperties() {
    const account = useActiveAccount();
    const [userProperties, setUserProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    // Modal state
    const [selectedPropertyId, setSelectedPropertyId] = useState<bigint | null>(null);
    const [modalType, setModalType] = useState<'details' | 'price' | null>(null);

    const contract = getContract({
        client,
        chain: polygonAmoy,
        address: "0x77Cf5f9aEf80d5f73d3A31CE4C86fa3aD60AED18",
    });

    const fetchUserProperties = async () => {
        // ... existing fetch logic
        if (!account) return;

        setError(null);
        setLoading(true);

        try {
            const data = await readContract({
                contract,
                method: "function getUserProperty(address user) external view returns ((uint256 propertyID, address owner, uint256 price, string propertyTitle, string category, string image, string propertyAddress, string description, address[] reviewers, string[] reviews)[])",
                params: [account.address],
            });

            setUserProperties(data as Property[]);
        } catch (err) {
            console.error("Error fetching user properties:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (account) {
            fetchUserProperties();
        }
    }, [account]);

    const openModal = (propertyId: bigint, type: 'details' | 'price') => {
        setSelectedPropertyId(propertyId);
        setModalType(type);
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    const closeModal = () => {
        setModalType(null);
        setSelectedPropertyId(null);
        document.body.style.overflow = 'unset'; // Restore scrolling
        fetchUserProperties(); // Refresh properties after update
    };

    if (!account) return null;

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500 mb-4">Error loading properties</p>
                <button
                    onClick={fetchUserProperties}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="w-full">
            {userProperties.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-muted/30 rounded-2xl border border-dashed border-border text-center">
                    <div className="bg-muted p-4 rounded-full mb-4">
                        <Home className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">No properties listed</h3>
                    <p className="text-muted-foreground mt-1 max-w-sm">
                        You have not listed any properties yet. Once you do, they will appear here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userProperties.map((property) => (
                        <div
                            key={property.propertyID.toString()}
                            className="group bg-card hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden border border-border flex flex-col"
                        >
                            {/* Image Section */}
                            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                <img
                                    src={property.image}
                                    alt={property.propertyTitle}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        e.currentTarget.src = "https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&w=800&q=80";
                                    }}
                                />
                                <div className="absolute top-3 right-3">
                                    <span className="bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                                        {property.category}
                                    </span>
                                </div>
                                <div className="absolute bottom-3 left-3">
                                    <span className="bg-primary text-white text-sm font-bold px-3 py-1 rounded-lg shadow-sm">
                                        {(Number(property.price) / 1e18).toFixed(4)} MATIC
                                    </span>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-5 flex flex-col flex-grow">
                                <h3 className="text-lg font-bold text-foreground line-clamp-1 mb-2">
                                    {property.propertyTitle}
                                </h3>

                                <div className="flex items-center text-muted-foreground text-sm mb-4">
                                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                                    <span className="truncate">{property.propertyAddress}</span>
                                </div>

                                <div className="mt-auto pt-4 border-t border-border flex flex-col gap-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => openModal(property.propertyID, 'details')}
                                            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-muted hover:bg-muted/80 text-foreground text-sm font-medium rounded-lg transition-colors border border-border/50"
                                        >
                                            <Edit className="w-3.5 h-3.5" />
                                            Details
                                        </button>
                                        <button
                                            onClick={() => openModal(property.propertyID, 'price')}
                                            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium rounded-lg transition-colors border border-emerald-500/20"
                                        >
                                            <DollarSign className="w-3.5 h-3.5" />
                                            Price
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-xs font-medium px-2 py-1 bg-muted rounded text-muted-foreground">
                                            ID: {property.propertyID.toString()}
                                        </span>
                                        <Link
                                            href={`/property/${property.propertyID}`}
                                            className="text-primary text-sm font-semibold flex items-center hover:underline"
                                        >
                                            View Page <ArrowRight className="w-4 h-4 ml-1" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {modalType && selectedPropertyId !== null && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        className="bg-card w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-border flex flex-col animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 right-0 z-10 flex justify-end p-4 bg-card/80 backdrop-blur-sm">
                            <button
                                onClick={closeModal}
                                className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="px-6 pb-8 pt-2">
                            {modalType === 'details' && (
                                <UpdateProperty propertyId={selectedPropertyId} />
                            )}
                            {modalType === 'price' && (
                                <UpdatePropertyPrice propertyId={selectedPropertyId} />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}