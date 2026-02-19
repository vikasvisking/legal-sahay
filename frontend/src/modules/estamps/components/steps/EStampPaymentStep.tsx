"use client";

import { useEStampStore } from "@/modules/estamps/store/estamp.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, Banknote, ChevronLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { axiosInstance as axios } from "@/lib/axios"; // Use configured axios instance

export function EStampPaymentStep() {
    const { formData, fees, setStep, resetStore } = useEStampStore();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("upi");

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            // 1. Create Order in Backend
            const payload = {
                service_type: 'ESTAMP',
                state_id: formData.stateId || 1, // Defaulting for now
                article_id: 1, // Defaulting for now
                document_reason: formData.description,
                consideration_price: formData.considerationPrice,
                // Pricing matching fees
                stamp_amount: fees.stampDuty,
                service_fee: fees.serviceFee,
                shipping_fee: fees.deliveryFee,
                total_amount: fees.total,
                // Delivery
                delivery_type: 'DIGITAL',
                // Parties would be sent in a separate call or nested depending on API structure
                // For this mock, we assume order creation is enough
            };

            // Mock API delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // await axios.post('/orders/', payload);

            toast.success("Payment Successful!");
            toast.success("E-Stamp Application Submitted.");

            // redirect to dashboard
            router.push('/dashboard');
            resetStore();

        } catch (error) {
            console.error(error);
            toast.error("Payment Failed. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-primary/20 shadow-lg">
                <CardHeader className="bg-slate-50/50 border-b text-center py-8">
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Total Amount to Pay</p>
                    <h2 className="text-4xl font-bold text-primary">₹{fees.total}</h2>
                </CardHeader>
                <CardContent className="p-8 space-y-8">

                    <div className="space-y-4">
                        <Label className="text-base">Select Payment Method</Label>
                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 gap-4">

                            <Label htmlFor="upi" className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-blue-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                        <Wallet className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">UPI / QR Code</p>
                                        <p className="text-sm text-slate-500">Google Pay, PhonePe, Paytm</p>
                                    </div>
                                </div>
                                <RadioGroupItem value="upi" id="upi" />
                            </Label>

                            <Label htmlFor="card" className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-blue-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                        <CreditCard className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">Credit / Debit Card</p>
                                        <p className="text-sm text-slate-500">Visa, Mastercard, RuPay</p>
                                    </div>
                                </div>
                                <RadioGroupItem value="card" id="card" />
                            </Label>

                            <Label htmlFor="netbanking" className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-blue-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                        <Banknote className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">Net Banking</p>
                                        <p className="text-sm text-slate-500">All major Indian banks supported</p>
                                    </div>
                                </div>
                                <RadioGroupItem value="netbanking" id="netbanking" />
                            </Label>
                        </RadioGroup>
                    </div>

                    <Button
                        size="lg"
                        className="w-full text-lg h-14"
                        onClick={handlePayment}
                        disabled={isProcessing}
                    >
                        {isProcessing ? "Processing Payment..." : `Pay ₹${fees.total}`}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Secure Payment via Razorpay/PhonePe
                    </div>

                </CardContent>
            </Card>

            <div className="text-center">
                <Button variant="link" onClick={() => setStep(2)} disabled={isProcessing}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back to Verification
                </Button>
            </div>
        </div>
    );
}
