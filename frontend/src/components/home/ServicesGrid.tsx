"use client";

import { motion } from "framer-motion";
import { FileText, Scale, ShieldCheck, UserCheck, ScrollText, Gavel } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
    {
        title: "Rental Agreements",
        description: "Create legally valid rental agreements for residential and commercial properties.",
        icon: FileText,
    },
    {
        title: "Affidavits",
        description: "Get affidavits for various purposes like name change, income proof, etc.",
        icon: ScrollText,
    },
    {
        title: "Legal Notices",
        description: "Send professional legal notices for recovery of dues, eviction, etc.",
        icon: Gavel,
    },
    {
        title: "Company Registration",
        description: "Register your Private Limited, LLP, or One Person Company easily.",
        icon: ShieldCheck,
    },
    {
        title: "Consultation",
        description: "Talk to expert lawyers for legal advice and guidance.",
        icon: UserCheck,
    },
    {
        title: "Property Verification",
        description: "Verify property documents before buying or renting.",
        icon: Scale,
    },
];

export function ServicesGrid() {
    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Our <span className="text-primary">Services</span>
                    </h2>
                    <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
                        We provide a wide range of legal services to meet your personal and business needs.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="h-full hover:shadow-lg transition-all hover:border-primary/50 group cursor-pointer">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-primary">
                                        <service.icon className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="text-xl">{service.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">
                                        {service.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
