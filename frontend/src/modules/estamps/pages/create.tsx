"use client";

import { useEffect } from "react";
import { WizardStepper } from "@/modules/documents/components/WizardStepper";
import { useEStampStore } from "@/modules/estamps/store/estamp.store";
import { EStampDetailsStep } from "@/modules/estamps/components/steps/EStampDetailsStep";
import { EStampVerificationStep } from "@/modules/estamps/components/steps/EStampVerificationStep";
import { EStampPaymentStep } from "@/modules/estamps/components/steps/EStampPaymentStep";
import { FileText, CheckCircle2, CreditCard } from "lucide-react";


export default function CreateEStampPage() {
    const { currentStep, steps, setStep, resetStore } = useEStampStore();

    // Reset store on mount (fresh start)
    useEffect(() => {
        resetStore();
    }, []);

    const STEPS = [
        { id: 1, title: "Application Details", description: "Parties & Article Info", icon: FileText },
        { id: 2, title: "Verification", description: "Review Details", icon: CheckCircle2 },
        { id: 3, title: "Payment", description: "Secure Payment", icon: CreditCard },
    ];

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-140px)] container mx-auto max-w-8xl px-4 py-8 gap-6">

            {/* LEFT: Stepper (Desktop) */}
            <div className="hidden md:block w-72 shrink-0 sticky top-24 self-start">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">New E-Stamp</h1>
                    <p className="text-sm text-slate-500 mt-1">Create legal stamp paper instantly.</p>
                </div>
                <WizardStepper
                    steps={STEPS}
                    currentStep={currentStep}
                    orientation="vertical"
                    onStepClick={setStep}
                />
            </div>

            {/* TOP: Stepper (Mobile Only) */}
            <div className="md:hidden sticky top-[64px] z-30 bg-slate-50/95 backdrop-blur -mx-4 px-4 py-2 border-b mb-6">
                <WizardStepper
                    steps={STEPS}
                    currentStep={currentStep}
                    orientation="horizontal"
                    compact={true}
                    onStepClick={setStep}
                />
            </div>

            {/* RIGHT: Main Content */}
            <main className="flex-1 min-w-0">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-1 md:p-0">
                    {/* Inner content wrapper for padding */}
                    <div className="p-4 md:p-6 lg:p-8">
                        {currentStep === 1 && <EStampDetailsStep />}
                        {currentStep === 2 && <EStampVerificationStep />}
                        {currentStep === 3 && <EStampPaymentStep />}
                    </div>
                </div>
            </main>
        </div>
    );
}
