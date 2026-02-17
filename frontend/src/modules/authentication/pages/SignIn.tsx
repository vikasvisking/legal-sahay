"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import Link from "next/link";
import { Loader2, MessageCircle, ArrowLeft } from "lucide-react";
import { AuthService } from "@/modules/authentication/services/auth.service";
import { useUserStore } from "@/store/user-store";
import { toast } from "sonner";

export default function SignIn() {
    const router = useRouter();
    const { login } = useUserStore();
    const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (phoneNumber.length < 10) {
            setError("Please enter a valid phone number");
            return;
        }

        setLoading(true);
        setError("");
        try {
            await AuthService.sendOtp(phoneNumber);
            setStep("OTP");
        } catch (err: any) {
            setError(err.message || "Failed to send OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const data = await AuthService.verifyOtp(phoneNumber, otp);

            // Update Store
            login(data.user, data.tokens);

            toast.success("Welcome back!", {
                description: "You have successfully signed in.",
            });

            router.push("/documents/create"); // Redirect to Document Creation Flow
        } catch (err: any) {
            toast.error("Authentication Failed", {
                description: err.message || "Invalid OTP. Please try again.",
            });
            setError(err.message || "Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight">
                    {step === "PHONE" ? "Welcome Back" : "Verify OTP"}
                </h1>
                <p className="text-muted-foreground">
                    {step === "PHONE"
                        ? "Enter your mobile number to securely sign in or sign up."
                        : `Enter the code sent to +91 ${phoneNumber}`
                    }
                </p>
            </div>

            <div className="space-y-4">
                {step === "PHONE" ? (
                    <form className="space-y-4" onSubmit={handleSendOtp}>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Mobile Number</Label>
                            <div className="flex gap-2">
                                <div className="flex items-center justify-center w-16 rounded-md border text-sm bg-muted text-muted-foreground">
                                    +91
                                </div>
                                <Input
                                    id="phone"
                                    placeholder="9876543210"
                                    type="tel"
                                    maxLength={10}
                                    value={phoneNumber}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, "");
                                        setPhoneNumber(val);
                                        setError("");
                                    }}
                                    className="flex-1"
                                />
                            </div>
                        </div>

                        {error && <p className="text-sm text-destructive font-medium">{error}</p>}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Request OTP
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                            </div>
                        </div>

                        <Button variant="outline" className="w-full text-foreground/80 hover:bg-muted" type="button">
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Google
                        </Button>

                        <Button variant="outline" className="w-full border-green-600/20 text-green-700 hover:bg-green-50 hover:text-green-800" type="button">
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Request via WhatsApp
                        </Button>
                    </form>
                ) : (
                    <form className="space-y-6" onSubmit={handleVerifyOtp}>
                        <div className="flex justify-center">
                            <InputOTP
                                maxLength={6}
                                value={otp}
                                onChange={(val) => {
                                    setOtp(val);
                                    setError("");
                                }}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        {error && <p className="text-sm text-center text-destructive font-medium">{error}</p>}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Verify & Continue
                        </Button>

                        <div className="text-center">
                            <Button
                                variant="link"
                                className="text-sm text-muted-foreground"
                                onClick={() => setStep("PHONE")}
                                type="button"
                            >
                                Change Phone Number
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
