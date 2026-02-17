"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
    {
        name: "Amit Sharma",
        role: "Business Owner",
        content: "Legal Sahay made company registration so easy! Highly recommended for quick service.",
        rating: 5,
        initial: "AS"
    },
    {
        name: "Priya Patel",
        role: "Tenant",
        content: "Generated my rental agreement in 5 minutes. The process was super smooth and legally valid.",
        rating: 5,
        initial: "PP"
    },
    {
        name: "Rahul Verma",
        role: "Freelancer",
        content: "Affordable and reliable. The customer support guided me through the affidavit process.",
        rating: 4,
        initial: "RV"
    }
];

export function Testimonials() {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-3xl font-bold text-center mb-12">
                    What our <span className="text-primary">Users Say</span>
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="bg-card border-none shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="pt-6">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < testimonial.rating ? "text-amber-500 fill-amber-500" : "text-slate-300"}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-muted-foreground mb-6">"{testimonial.content}"</p>
                            </CardContent>
                            <CardFooter className="flex items-center gap-4 border-t pt-4">
                                <Avatar>
                                    <AvatarImage src="" />
                                    <AvatarFallback className="bg-primary/10 text-primary">{testimonial.initial}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-sm text-foreground">{testimonial.name}</p>
                                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
