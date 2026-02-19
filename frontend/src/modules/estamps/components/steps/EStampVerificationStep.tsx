"use client";

import { useState, useEffect } from "react";
import { useEStampStore } from "@/modules/estamps/store/estamp.store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, Stamp, Truck, User, FileCheck, Receipt, ShieldCheck } from "lucide-react";

export function EStampVerificationStep() {
    const { formData, fees, calculateFees, setStep } = useEStampStore();
    const [isConfirmed, setIsConfirmed] = useState(false);

    useEffect(() => {
        calculateFees();
    }, [formData.considerationPrice, formData.stampDutyAmount, formData.deliveryMode]);

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="grid md:grid-cols-3 gap-8">
                {/* Summary Card */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="bg-slate-50/50 border-b pb-4 relative">
                            <CardTitle className="text-lg text-primary">Application Summary</CardTitle>
                            <CardDescription>Please verify all details carefully before payment.</CardDescription>
                            <Button variant="default" size="sm" onClick={() => setStep(1)} className="absolute top-4 right-4 shadow-sm">
                                <ChevronLeft className="mr-2 h-4 w-4" /> Edit Details
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">

                            {/* Document Info */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Document Info</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-slate-500">State</p>
                                        <p className="font-medium">{formData.stateId}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">Article</p>
                                        <p className="font-medium">{formData.articleId}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-slate-500">Description</p>
                                        <p className="font-medium">{formData.description}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">Stamp Duty Amount</p>
                                        <p className="font-medium">₹{formData.stampDutyAmount}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">Considering Price</p>
                                        <p className="font-medium">₹{formData.considerationPrice}</p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Stamp Duty & Delivery */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Stamp className="h-4 w-4" /> Duty & Delivery
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-slate-500">Paid By</p>
                                        <p className="font-medium">{formData.stampDutyPaidBy === 'FIRST_PARTY' ? 'First Party' : 'Second Party'}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">Gender</p>
                                        <p className="font-medium capitalize">{formData.stampDutyPaidByGender.toLowerCase()}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500">Delivery Mode</p>
                                        <div className="flex items-center gap-2">
                                            <Truck className="h-4 w-4 text-slate-400" />
                                            <p className="font-medium capitalize">{formData.deliveryMode.toLowerCase()}</p>
                                        </div>
                                    </div>

                                    {/* Show Shipping Address if Physical */}
                                    {formData.deliveryMode === 'PHYSICAL' && formData.shippingAddress && (
                                        <div className="col-span-2 mt-2 pt-2 border-t">
                                            <p className="text-slate-500 text-xs mb-1">Shipping Address</p>
                                            <p className="font-medium">
                                                {formData.shippingAddress.name}, {formData.shippingAddress.mobile}<br />
                                                {formData.shippingAddress.address}, {formData.shippingAddress.city}, {formData.shippingAddress.state} - {formData.shippingAddress.pincode}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* Parties Info */}
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <User className="h-4 w-4" /> First Party
                                    </h3>
                                    <div className="space-y-3 text-sm leading-relaxed">
                                        <p><span className="text-slate-500 block text-xs uppercase tracking-wide">Name</span> <span className="font-medium text-slate-900">{formData.firstParty.name}</span></p>
                                        <p><span className="text-slate-500 block text-xs uppercase tracking-wide">Relative</span> <span className="font-medium text-slate-900">{formData.firstParty.relationName || "-"}</span></p>
                                        <p><span className="text-slate-500 block text-xs uppercase tracking-wide">PAN</span> <span className="font-medium text-slate-900">{formData.firstParty.pan || "-"}</span></p>
                                        <p><span className="text-slate-500 block text-xs uppercase tracking-wide">Address</span>
                                            <span className="font-medium block text-slate-700 mt-1 leading-normal">
                                                {formData.firstParty.address},<br />
                                                {formData.firstParty.city}, {formData.firstParty.state} - {formData.firstParty.pincode}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <User className="h-4 w-4" /> Second Party
                                    </h3>
                                    <div className="space-y-3 text-sm leading-relaxed">
                                        <p><span className="text-slate-500 block text-xs uppercase tracking-wide">Name</span> <span className="font-medium text-slate-900">{formData.secondParty.name}</span></p>
                                        <p><span className="text-slate-500 block text-xs uppercase tracking-wide">Relative</span> <span className="font-medium text-slate-900">{formData.secondParty.relationName || "-"}</span></p>
                                        <p><span className="text-slate-500 block text-xs uppercase tracking-wide">PAN</span> <span className="font-medium text-slate-900">{formData.secondParty.pan || "-"}</span></p>
                                        <p><span className="text-slate-500 block text-xs uppercase tracking-wide">Address</span>
                                            <span className="font-medium block text-slate-700 mt-1 leading-normal">
                                                {formData.secondParty.address},<br />
                                                {formData.secondParty.city}, {formData.secondParty.state} - {formData.secondParty.pincode}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </CardContent>
                    </Card>



                    <div className={cn(
                        "flex items-start space-x-3 p-5 border rounded-xl transition-all duration-300",
                        isConfirmed
                            ? "bg-emerald-100 border-emerald-400 shadow-sm"
                            : "bg-amber-100 border-amber-400"
                    )}>
                        <Checkbox
                            id="verify"
                            checked={isConfirmed}
                            onCheckedChange={(c) => setIsConfirmed(c as boolean)}
                            className={cn(
                                "mt-1",
                                isConfirmed
                                    ? "data-[state=checked]:bg-emerald-700 data-[state=checked]:border-emerald-700 border-emerald-500"
                                    : "border-amber-600"
                            )}
                        />
                        <div className="grid gap-1.5 leading-relaxed">
                            <Label
                                htmlFor="verify"
                                className={cn(
                                    "text-sm font-bold peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer",
                                    isConfirmed ? "text-emerald-950" : "text-amber-950"
                                )}
                            >
                                I confirm that the above details are correct.
                            </Label>
                            <p className={cn(
                                "text-xs leading-relaxed font-medium",
                                isConfirmed ? "text-emerald-800" : "text-amber-800"
                            )}>
                                Once the stamp paper is generated, it cannot be refunded or corrected. Please verify names and amounts carefully.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: Payment Preview */}
                <div className="md:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        <Card className="border-0 shadow-xl bg-white overflow-hidden ring-1 ring-slate-100">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-600" />
                            <CardHeader className="pb-4 bg-slate-50/50 border-b">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Receipt className="h-5 w-5 text-primary" /> Payment Breakdown
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-5">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm items-center">
                                        <span className="text-slate-600 flex items-center gap-2">
                                            <FileCheck className="h-4 w-4 text-slate-400" /> Stamp Duty
                                        </span>
                                        <span className="font-medium">₹{fees.stampDuty}</span>
                                    </div>
                                    <div className="flex justify-between text-sm items-center">
                                        <span className="text-slate-600 flex items-center gap-2">
                                            <ShieldCheck className="h-4 w-4 text-slate-400" /> Service Fee
                                        </span>
                                        <span className="font-medium">₹{fees.serviceFee}</span>
                                    </div>
                                    <div className="flex justify-between text-sm items-center">
                                        <span className="text-slate-600 flex items-center gap-2">
                                            <Truck className="h-4 w-4 text-slate-400" /> Delivery
                                        </span>
                                        <span className="font-medium">₹{fees.deliveryFee}</span>
                                    </div>
                                </div>

                                <Separator className="bg-slate-100" />

                                <div className="flex justify-between items-center pt-2">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-slate-500 font-medium">Total Payable</span>
                                        <span className="font-bold text-2xl text-primary">₹{fees.total}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => setStep(3)}
                                    className="w-full h-12 text-base shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40"
                                    size="lg"
                                    disabled={!isConfirmed}
                                >
                                    Pay Now <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>

                                <p className="text-[10px] text-center text-slate-400 leading-tight">
                                    Secure payment powered by Razorpay. <br /> By paying you agree to our terms.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div >



        </div >
    );
}
