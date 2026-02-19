import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface Step {
    id: number;
    title: string;
    description: string;
    icon: React.ElementType;
}

interface WizardStepperProps {
    currentStep: number;
    steps: Step[];
    compact?: boolean;
    orientation?: "horizontal" | "vertical";
    onStepClick?: (stepId: number) => void;
}

export function WizardStepper({ currentStep, steps, compact = false, orientation = "horizontal", onStepClick }: WizardStepperProps) {
    const isVertical = orientation === "vertical";

    return (
        <div className={cn(
            "w-full transition-all duration-300",
            isVertical ? "h-full py-6 pr-4 hidden md:block pl-2" : "py-4",
            isVertical && "bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-6"
        )}>
            <div className={cn(
                "flex relative",
                isVertical ? "flex-col space-y-0" : "w-full items-center justify-between px-2 md:px-10"
            )}>
                {/* Background Line for Horizontal */}
                {!isVertical && (
                    <div className="absolute top-[20px] left-[30px] right-[30px] h-[2px] bg-slate-100 -z-10" />
                )}

                {steps.map((step, index) => {
                    const isCompleted = currentStep > step.id;
                    const isCurrent = currentStep === step.id;
                    const StepIcon = step.icon;
                    const isClickable = step.id < currentStep;

                    return (
                        <div
                            key={step.id}
                            className={cn(
                                "relative flex z-20",
                                isVertical ? "min-h-[80px] last:min-h-0" : "flex-col items-center",
                                isClickable ? "cursor-pointer" : "cursor-default"
                            )}
                            onClick={() => {
                                if (isClickable && onStepClick) {
                                    onStepClick(step.id);
                                }
                            }}
                        >
                            {/* Vertical Connecting Line */}
                            {isVertical && index < steps.length - 1 && (
                                <div className="absolute left-[20px] top-[40px] bottom-[-4px] w-[2px] bg-slate-100 -z-10">
                                    <motion.div
                                        initial={{ height: "0%" }}
                                        animate={{ height: isCompleted ? "100%" : "0%" }}
                                        className="w-full bg-primary origin-top"
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                    />
                                </div>
                            )}

                            {/* Horizontal Connecting Line */}
                            {!isVertical && index < steps.length - 1 && (
                                <div className="absolute top-[20px] left-[50%] w-[calc(100%_-_20px)] h-[2px] -z-10 hidden sm:block">
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        animate={{ width: isCompleted ? "100%" : "0%" }}
                                        className="h-full bg-primary origin-left"
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            )}

                            {/* Step Indicator + Content Wrapper */}
                            <div className={cn("flex w-full", isVertical ? "gap-4 items-start" : "flex-col items-center")}>
                                {/* Icon Container */}
                                <div
                                    className={cn(
                                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 z-10 text-sm transition-all duration-300",
                                        isCompleted
                                            ? "bg-emerald-600 border-emerald-600 text-white"
                                            : isCurrent
                                                ? "bg-primary border-primary text-primary-foreground"
                                                : "bg-white border-slate-200 text-slate-400",
                                        isCurrent && "shadow-[0_4px_10px_hsl(var(--primary)/0.3)] ring-2 ring-primary/20 ring-offset-2"
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="h-4 w-4 stroke-[3]" />
                                    ) : (
                                        <StepIcon className="h-4 w-4" />
                                    )}
                                </div>

                                {/* Text Content */}
                                <div className={cn(
                                    "transition-all duration-300 flex flex-col justify-center pt-1",
                                    isVertical ? "pt-0" : "mt-2 text-center",
                                    (isCurrent || isCompleted) ? "opacity-100" : "opacity-50"
                                )}>
                                    {isVertical ? (
                                        <div className="flex flex-col">
                                            <h3 className={cn(
                                                "text-sm font-semibold leading-tight transition-colors duration-300",
                                                isCurrent ? "text-primary" : isCompleted ? "text-slate-800" : "text-slate-600"
                                            )}>
                                                {step.title}
                                            </h3>
                                            <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed mt-1">
                                                {step.description}
                                            </p>
                                        </div>
                                    ) : (
                                        <span className={cn(
                                            "text-[10px] font-bold uppercase tracking-wider block",
                                            isCurrent ? "text-primary" : "text-slate-400"
                                        )}>
                                            {step.title}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
