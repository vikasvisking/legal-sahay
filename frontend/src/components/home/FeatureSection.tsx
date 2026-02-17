"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const features = [
    "Legally compliant documents drafted by experts",
    "Instant download in Word/PDF formats",
    "Secure and confidential data handling",
    "24/7 Customer Support assistance",
    "Affordable pricing with no hidden charges",
    "Easy to use interface for everyone"
];

export function FeatureSection() {
    return (
        <section className="py-20 bg-slate-950 text-slate-50 relative overflow-hidden">
            {/* Background gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/30 blur-[100px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/20 blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                            Why Choose <span className="text-primary">Legal Sahay</span>?
                        </h2>
                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                            We combine legal expertise with technology to make documentation hassle-free.
                            Whether you need a rental agreement or a business contract, we have you covered.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                                    <span className="text-slate-200">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Abstract Visual / Illustration Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative h-[400px] w-full rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-8 flex items-center justify-center overflow-hidden group hover:border-primary/30 transition-colors"
                    >
                        <div className="absolute inset-0 bg-grid-slate-700/[0.2] bg-[length:30px_30px]" />

                        {/* Center Circle */}
                        <div className="relative z-10 w-40 h-40 rounded-full bg-slate-950 border-4 border-slate-800 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                            <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                                <div className="text-4xl font-bold text-primary">LS</div>
                            </div>
                        </div>

                        {/* Orbiting Elements */}
                        <div className="absolute w-[280px] h-[280px] rounded-full border border-slate-700/50 animate-[spin_10s_linear_infinite]" />
                        <div className="absolute w-[350px] h-[350px] rounded-full border border-dashed border-slate-700/30 animate-[spin_15s_linear_infinite_reverse]" />

                    </motion.div>
                </div>
            </div>
        </section>
    );
}
