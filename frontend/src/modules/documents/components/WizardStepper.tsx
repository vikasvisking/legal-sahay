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
}

export function WizardStepper({ currentStep, steps }: WizardStepperProps) {
    return (
        <div className="w-full py-6">
            <div className="flex w-full items-center justify-between relative pl-[20px] pr-[20px]">
                {/* Background Line */}
                <div className="absolute top-[28px] left-[40px] right-[40px] h-[3px] bg-muted -z-10 w-[calc(100%_-_80px)]" />

                {steps.map((step, index) => {
                    const isCompleted = currentStep > step.id;
                    const isCurrent = currentStep === step.id;

                    return (
                        <div key={step.id} className="flex flex-col items-center relative z-20">
                            <motion.div
                                initial={false}
                                animate={{
                                    backgroundColor: isCompleted ? "hsl(var(--secondary))" : "white",
                                    borderColor: isCompleted ? "hsl(var(--secondary))" : isCurrent ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                                    scale: isCurrent ? 1 : 0.75,
                                    boxShadow: isCurrent ? "0 0 0 4px hsl(var(--primary) / 0.2)" : "none",
                                }}
                                transition={{ duration: 0.3 }}
                                className={cn(
                                    "flex h-14 w-14 items-center justify-center rounded-full border-2 shadow-sm relative z-10 bg-white",
                                    isCompleted ? "text-secondary border-secondary" : isCurrent ? "text-primary border-primary" : "text-muted-foreground border-muted-foreground"
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="h-6 w-6" />
                                ) : (
                                    <step.icon className="h-6 w-6" />
                                )}
                            </motion.div>

                            <div className="mt-3 flex flex-col items-center text-center">
                                <motion.span
                                    animate={{ color: isCompleted ? "hsl(var(--secondary))" : isCurrent ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}
                                    className="text-sm font-bold"
                                >
                                    {step.title}
                                </motion.span>
                                <motion.span
                                    animate={{ opacity: isCurrent ? 1 : 0.7 }}
                                    className="text-xs text-muted-foreground hidden sm:block mt-1 font-medium"
                                >
                                    {step.description}
                                </motion.span>
                            </div>

                            {/* Connecting Line Progress */}
                            {index < steps.length - 1 && (
                                <div className="absolute top-[28px] left-[50%] w-[calc(100%_-_20px)] h-[3px] -z-10 hidden md:block">
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        animate={{ width: isCompleted ? "200%" : "0%" }} // Adjusted for spacing
                                        className="h-full bg-primary origin-left"
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
