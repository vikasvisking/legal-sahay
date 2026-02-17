"use client";

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

export default function CreateDocument() {
    const { currentStep } = useDocumentStore();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-6 px-4">
            <div className="container mx-auto max-w-5xl">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 text-center"
                >
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Create Legal Document</h1>
                    <p className="text-sm text-muted-foreground">Follow the simple steps to draft your document in minutes.</p>
                </motion.div>

                {/* Wizard Stepper - Sticky */}
                <div className="sticky top-0 z-50 bg-slate-50/95 backdrop-blur supports-[backdrop-filter]:bg-slate-50/60 py-4 mb-2 -mx-4 px-4">
                    <div className="max-w-3xl mx-auto">
                        <WizardStepper currentStep={currentStep} steps={STEPS} />
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
