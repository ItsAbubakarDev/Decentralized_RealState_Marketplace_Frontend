import { Wallet, Search, Home } from "lucide-react";

const steps = [
    {
        icon: Wallet,
        title: "Connect Wallet",
        description: "Link your crypto wallet to start exploring exclusive blockchain properties.",
    },
    {
        icon: Search,
        title: "Browse & Select",
        description: "Filter through verified listings and find your perfect investment or home.",
    },
    {
        icon: Home,
        title: "Buy with Crypto",
        description: "Purchase instantly using ETH or stablecoins with smart contract security.",
    },
];

const HowItWorks = () => {
    return (
        <section className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">How It Works</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Buying real estate has never been easier. Transition from traditional to digital in three simple steps.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -z-1" />

                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center relative z-10">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black border border-border flex items-center justify-center mb-8 shadow-xl shadow-primary/5 group hover:border-primary/50 transition-colors duration-300">
                                <step.icon size={40} className="text-primary group-hover:scale-110 transition-transform duration-300" />
                            </div>

                            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4 border border-primary/20">
                                STEP 0{index + 1}
                            </div>

                            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                            <p className="text-muted-foreground leading-relaxed px-4">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
