"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Hero() {
    return (
        <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden bg-background">
            {/* Background radial gradient */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] opacity-20 dark:bg-slate-950 dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]" />

            <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                >
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
                        Legal <span className="text-primary">Documentation</span> <br />
                        Made <span className="text-secondary">Easy</span>
                    </h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                        Create, customize, and download legal documents in minutes.
                        Secure, reliable, and legally valid.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-10 w-full max-w-2xl flex gap-2 p-2 bg-white/50 backdrop-blur-sm rounded-full border shadow-lg dark:bg-slate-900/50"
                >
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Search for 'Rental Agreement' or 'Affidavit'..."
                            className="pl-10 h-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base rounded-full"
                        />
                    </div>
                    <Button size="lg" className="rounded-full px-8 h-12 text-base">
                        Search
                    </Button>
                </motion.div>

                {/* Floating Cards / Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-4xl"
                >
                    {[
                        "Rental Agreement",
                        "Affidavits",
                        "Legal Notices",
                        "Consultation"
                    ].map((item, index) => (
                        <div
                            key={item}
                            className="group flex flex-col items-center justify-center p-6 bg-card rounded-xl shadow-sm border hover:shadow-md hover:border-primary/50 transition-all cursor-pointer"
                        >
                            <div className="h-10 w-10 mb-3 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                {/* Icon placeholder - could map icons later */}
                                <div className="h-4 w-4 bg-primary rounded-sm" />
                            </div>
                            <span className="font-medium text-sm md:text-base">{item}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
