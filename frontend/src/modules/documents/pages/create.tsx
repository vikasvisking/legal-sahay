"use client";

import * as React from "react";

import { motion } from "framer-motion";
import { MapPin, FileEdit, FileText, CreditCard } from "lucide-react";

import { WizardStepper } from "../components/WizardStepper";
import { useDocumentStore } from "../store/document.store";
import { LocationStep } from "../components/steps/LocationStep";
import { DetailsStep } from "../components/steps/DetailsStep";

const STEPS = [
    { id: 1, title: "Location", description: "Select Type & Location", icon: MapPin },
    { id: 2, title: "Details", description: "Fill Document Details", icon: FileEdit },
    { id: 3, title: "Review", description: "Review & Confirm", icon: FileText },
    { id: 4, title: "Payment", description: "Secure Payment", icon: CreditCard },
];

import { useScrollDirection } from "@/hooks/use-scroll-direction";

export default function CreateDocument() {
    const { currentStep } = useDocumentStore();
    const scrollDirection = useScrollDirection();
    const [isSticky, setIsSticky] = React.useState(false);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                console.log('Sticky Sentinel Intersecting:', entry.isIntersecting, entry.boundingClientRect.top);
                setIsSticky(!entry.isIntersecting);
            },
            { threshold: 0 }
        );
        const sentinel = document.getElementById("sticky-sentinel");
        if (sentinel) observer.observe(sentinel);

        return () => {
            if (sentinel) observer.unobserve(sentinel);
        };
    }, []);

    // Show when scrolling up OR when at the very top (not sticky yet)
    const isVisible = scrollDirection === "up" || !isSticky;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-6 px-4">
            <div className="w-full max-w-[1920px] mx-auto px-4 lg:px-8 relative">

                {/* Header Section */}
                {/* <motion.div ... /> */}

                {/* Sentinel for sticky detection - In-flow 1px div */}
                <div id="sticky-sentinel" className="h-[1px] w-full" />


                <div className={`sticky top-0 z-50 transition-all duration-300 transform ${isVisible ? 'translate-y-0' : '-translate-y-[150%]'} ${isSticky ? 'py-2 bg-slate-50/95 backdrop-blur supports-[backdrop-filter]:bg-slate-50/60 -mx-4 px-4' : 'py-4 mb-2'}`}>
                    <div className="max-w-3xl mx-auto">
                        <WizardStepper currentStep={currentStep} steps={STEPS} compact={isSticky} />
                    </div>
                </div>

                {/* Dynamic Step Content */}
                <div className="min-h-[400px]">
                    {currentStep === 1 && <LocationStep />}
                    {currentStep === 2 && <DetailsStep />}
                    {currentStep === 3 && <div className="text-center p-10">Review Step (Coming Soon)</div>}
                    {currentStep === 4 && <div className="text-center p-10">Payment Step (Coming Soon)</div>}
                </div>

            </div>
        </div>
    );
}
