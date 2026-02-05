import { ShieldCheck, Zap, Globe } from "lucide-react";

const benefits = [
    {
        icon: ShieldCheck,
        title: "Security & Transparency",
        description: "Every transaction is recorded on the blockchain, ensuring immutable ownership records and eliminating fraud.",
    },
    {
        icon: Zap,
        title: "Instant Verification",
        description: "Smart contracts automate the verification process, reducing closing times from months to minutes.",
    },
    {
        icon: Globe,
        title: "Global Accessibility",
        description: "Invest in properties anywhere in the world without geographical restrictions or complex banking hurdles.",
    },
];

const Benefits = () => {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px] rounded-full -z-1" />
            <div className="absolute bottom-0 left-0 w-1/3 h-full bg-blue-500/5 blur-[120px] rounded-full -z-1" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Why Choose <span className="text-primary">Web3</span> Real Estate?
                        </h2>
                        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                            Traditional real estate is slow, opaque, and expensive. We're rebuilding the system from the ground up to be faster, safer, and open to everyone.
                        </p>

                        <div className="space-y-8">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex gap-5">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            <benefit.icon size={24} />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                                        <p className="text-muted-foreground">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative z-10 grid grid-cols-2 gap-4">
                            <div className="space-y-4 translate-y-8">
                                <div className="h-64 rounded-2xl bg-zinc-900 border border-zinc-800 p-6 flex flex-col justify-end">
                                    <span className="text-4xl font-bold text-white mb-1">24/7</span>
                                    <span className="text-muted-foreground text-sm">Market Access</span>
                                </div>
                                <div className="h-48 rounded-2xl bg-gradient-to-br from-primary to-orange-600 p-6 flex flex-col justify-end text-white">
                                    <span className="text-4xl font-bold mb-1">0%</span>
                                    <span className="text-white/80 text-sm">Paperwork</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-48 rounded-2xl bg-zinc-900 border border-zinc-800 p-6 flex flex-col justify-end">
                                    <span className="text-4xl font-bold text-white mb-1">100%</span>
                                    <span className="text-muted-foreground text-sm">Transparency</span>
                                </div>
                                <div className="h-64 rounded-2xl bg-zinc-900 border border-zinc-800 p-6 flex flex-col justify-end">
                                    <span className="text-4xl font-bold text-white mb-1">Instant</span>
                                    <span className="text-muted-foreground text-sm">Settlement</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Benefits;
