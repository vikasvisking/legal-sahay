"use client";

import { useEffect, useState } from "react";
import { useEStampStore } from "@/modules/estamps/store/estamp.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Landmark, ChevronRight, Stamp, Truck, MapPin, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormData } from "@/modules/estamps/constants/estamp.schema";

export function EStampDetailsStep() {
    const { formData: storeData, updateFormData, updatePartyDetails, updateShippingAddress, setStep } = useEStampStore();

    const [states, setStates] = useState<{ id: number, name: string }[]>([]);
    const [articles, setArticles] = useState<{ id: number, title: string }[]>([]);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            stateId: storeData.stateId || "",
            articleId: storeData.articleId || "",
            description: storeData.description,
            considerationPrice: String(storeData.considerationPrice),
            stampDutyPaidBy: storeData.stampDutyPaidBy,
            stampDutyAmount: String(storeData.stampDutyAmount),
            stampDutyPaidByGender: storeData.stampDutyPaidByGender,
            firstParty: storeData.firstParty,
            secondParty: storeData.secondParty,
            deliveryMode: storeData.deliveryMode,
            shippingAddressType: storeData.shippingAddressType as "FIRST_PARTY" | "SECOND_PARTY" | "NEW", // Cast safe
            shippingAddress: storeData.shippingAddress,
            shippingEmail: storeData.shippingEmail || "",
            shippingMobile: storeData.shippingMobile || "",
        }
    });

    const { watch, setValue, control, handleSubmit, formState: { errors }, trigger } = form; // Added trigger
    const watchStateId = watch("stateId");
    const watchShippingType = watch("shippingAddressType");
    const watchDeliveryMode = watch("deliveryMode");
    const isShippingReadOnly = watchShippingType === "FIRST_PARTY" || watchShippingType === "SECOND_PARTY";

    // Persist to store on change
    useEffect(() => {
        const subscription = form.watch((value) => {
            // We can selectively update store or update all. 
            // Ideally verify if we need live store updates. 
            // For "Verification" step, yes we do.
            updateFormData({
                ...value as any, // Warning: Loose typing here for simplicity
            });
        });
        return () => subscription.unsubscribe();
    }, [form, updateFormData]);


    // Fetch States
    useEffect(() => {
        const fetchStates = async () => {
            try {
                const { EStampService } = await import("../../services/estamp.service");
                const data = await EStampService.getStates();
                setStates(data);
            } catch (err) { console.error(err); }
        };
        fetchStates();
    }, []);

    // Fetch Articles
    useEffect(() => {
        const fetchArticles = async () => {
            if (!watchStateId) return;

            try {
                const { EStampService } = await import("../../services/estamp.service");
                const data = await EStampService.getArticles(watchStateId);
                setArticles(data);

                // Logic to reset articleId only if it's invalid for the current state or on state change
                // Instead of blindly clearing, we rely on the user to re-select if needed, or we check validity
                // But for now, let's just AVOID resetting it on mount if it's already set to something valid.

                // If articleId is set but not in the new list, THEN clear it? 
                // That requires waiting for data. 

                // Simpler check: If storeData.stateId !== watchStateId, it means user changed state, so reset article.
                // But watchStateId IS initialized from storeData... so that equality check is tricky on mount.

                // Better: Just check if the current articleId exists in the fetched list. 
                // If not, clear it.
                // However, setting value inside async might cause race conditions or flicker.

                // Let's stick to the user issue: "Article value is also lost".
                // This means when they come back, storeData has `articleId`. 
                // But this effect runs, fetches, and then SETS IT TO "".
                // We should ONLY set it to "" if the user explicitly changed the state.

                // Since we can't easily distinguish mount vs change without a ref, let's use a ref.
            } catch (err) { console.error(err); }
        };
        fetchArticles();
    }, [watchStateId]); // Removed setValue from dependency to avoid loop, though it's stable

    // Separate effect to handle article reset on state change
    const [previousStateId, setPreviousStateId] = useState(storeData.stateId);

    useEffect(() => {
        if (watchStateId !== previousStateId) {
            setValue("articleId", "");
            setPreviousStateId(watchStateId);
        }
    }, [watchStateId, previousStateId, setValue]);

    // Handle Shipping Address Copy Logic
    const handleShippingTypeChange = (type: "FIRST_PARTY" | "SECOND_PARTY" | "NEW") => { // Corrected type here
        setValue("shippingAddressType", type);

        if (type === "FIRST_PARTY") {
            const fp = form.getValues("firstParty");
            setValue("shippingAddress", { ...fp });
        } else if (type === "SECOND_PARTY") {
            const sp = form.getValues("secondParty");
            setValue("shippingAddress", { ...sp });
        } else {
            // New Address - clear fields
            setValue("shippingAddress", {
                name: "", address: "", pincode: "", city: "", state: "", mobile: "" // reset structure
            });
        }
    };

    // Pincode Lookup Handler
    const handlePincodeLookup = async (
        pincode: string,
        fieldPrefix: "firstParty" | "secondParty" | "shippingAddress"
    ) => {
        if (pincode.length !== 6) return;

        try {
            const { PincodeService } = await import("@/modules/documents/services/pincode.service");
            const data = await PincodeService.getData(pincode);
            if (data.Status === "Success" && data.PostOffice?.length) {
                const { District, State } = data.PostOffice[0];
                setValue(`${fieldPrefix}.city`, District);
                setValue(`${fieldPrefix}.state`, State);

                // Also trigger validation for these fields to clear any errors
                trigger(`${fieldPrefix}.city`);
                trigger(`${fieldPrefix}.state`);
            } else {
                toast.error("Invalid Pincode");
            }
        } catch (err) {
            toast.error("Failed to fetch location details");
        }
    };

    const onSubmit = (data: FormData) => {
        console.log("Form Submitted:", data);
        updateFormData(data as any); // Sync fully before next
        setStep(2);
    };

    const onError = (errors: any) => {
        console.log("Validation Errors:", errors);
        toast.error("Please fix the errors in the form.");
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* WRAPPER FORM */}
            <div className="grid lg:grid-cols-2 gap-8">

                {/* --- Left Column: Document & Stamp --- */}
                <div className="space-y-8">
                    {/* Document Details */}
                    <Card>
                        <CardHeader className="pb-4 border-b bg-slate-50/50">
                            <CardTitle className="text-lg text-primary flex items-center gap-2">
                                <Landmark className="h-5 w-5" /> Document Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>State <span className="text-red-500">*</span></Label>
                                    <Controller
                                        control={control}
                                        name="stateId"
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={(val) => {
                                                    field.onChange(val);
                                                    const selectedState = states.find(s => String(s.id) === val);
                                                    if (selectedState) {
                                                        updateFormData({ stateName: selectedState.name });
                                                    }
                                                }}
                                            >
                                                <SelectTrigger className={errors.stateId && "border-red-500"}>
                                                    <SelectValue placeholder="Select State" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {states.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.stateId && <p className="text-xs text-red-500">{errors.stateId.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Article <span className="text-red-500">*</span></Label>
                                    <Controller
                                        control={control}
                                        name="articleId"
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={(val) => {
                                                    field.onChange(val);
                                                    const selectedArticle = articles.find(a => String(a.id) === val);
                                                    if (selectedArticle) {
                                                        updateFormData({ articleName: selectedArticle.title });
                                                    }
                                                }}
                                                disabled={!watchStateId}
                                            >
                                                <SelectTrigger className={errors.articleId && "border-red-500"}>
                                                    <SelectValue placeholder="Select a Article" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {articles.map(a => <SelectItem key={a.id} value={String(a.id)}>{a.title}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.articleId && <p className="text-xs text-red-500">{errors.articleId.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Description <span className="text-red-500">*</span></Label>
                                <Textarea
                                    {...form.register("description")}
                                    className={errors.description && "border-red-500"}
                                    placeholder="E.g. Rental Agreement..."
                                />
                                {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Consideration Price (₹) <span className="text-red-500">*</span></Label>
                                <Input
                                    type="number"
                                    {...form.register("considerationPrice")}
                                    className={errors.considerationPrice && "border-red-500"}
                                />
                                {errors.considerationPrice && <p className="text-xs text-red-500">{errors.considerationPrice.message}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stamp Duty */}
                    <Card>
                        <CardHeader className="pb-4 border-b bg-slate-50/50">
                            <CardTitle className="text-lg text-primary flex items-center gap-2">
                                <Stamp className="h-5 w-5" /> Stamp Duty Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8 pt-6">
                            <div className="space-y-4">
                                <Label>Stamp Duty Paid By <span className="text-red-500">*</span></Label>
                                <Controller
                                    control={control}
                                    name="stampDutyPaidBy"
                                    render={({ field }) => (
                                        <RadioGroup value={field.value} onValueChange={field.onChange} className="flex space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="FIRST_PARTY" id="sd_first" />
                                                <Label htmlFor="sd_first">First Party</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="SECOND_PARTY" id="sd_second" />
                                                <Label htmlFor="sd_second">Second Party</Label>
                                            </div>
                                        </RadioGroup>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Amount (₹) <span className="text-red-500">*</span></Label>
                                    <Input
                                        type="number"
                                        {...form.register("stampDutyAmount")}
                                        className={errors.stampDutyAmount && "border-red-500"}
                                    />
                                    {errors.stampDutyAmount && <p className="text-xs text-red-500">{errors.stampDutyAmount.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Payer Gender <span className="text-red-500">*</span></Label>
                                    <Controller
                                        control={control}
                                        name="stampDutyPaidByGender"
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className={errors.stampDutyPaidByGender && "border-red-500"}>
                                                    <SelectValue placeholder="Gender" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="MALE">Male</SelectItem>
                                                    <SelectItem value="FEMALE">Female</SelectItem>
                                                    <SelectItem value="OTHER">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.stampDutyPaidByGender && <p className="text-xs text-red-500">{errors.stampDutyPaidByGender.message}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Delivery Preference */}
                    <Card>
                        <CardHeader className="pb-4 border-b bg-slate-50/50">
                            <CardTitle className="text-lg text-primary flex items-center gap-3">
                                <Truck className="h-5 w-5" /> Delivery Preference
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <Controller
                                control={control}
                                name="deliveryMode"
                                render={({ field }) => (
                                    <RadioGroup value={field.value} onValueChange={field.onChange} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Label htmlFor="mode_digital" className={`flex items-center justify-between p-5 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors ${field.value === 'DIGITAL' ? 'border-primary bg-blue-50/50' : ''}`}>
                                            <div>
                                                <p className="font-semibold text-slate-900">E-Stamp (Digital)</p>
                                                <p className="text-xs text-slate-500 mt-1">Instant Download</p>
                                            </div>
                                            <RadioGroupItem value="DIGITAL" id="mode_digital" />
                                        </Label>
                                        <Label htmlFor="mode_physical" className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors ${field.value === 'PHYSICAL' ? 'border-primary bg-blue-50/50' : ''}`}>
                                            <div>
                                                <p className="font-semibold text-slate-900">Physical Delivery</p>
                                                <p className="text-xs text-slate-500">Courier to Address</p>
                                            </div>
                                            <RadioGroupItem value="PHYSICAL" id="mode_physical" />
                                        </Label>
                                    </RadioGroup>
                                )}
                            />

                            {/* Digital Delivery Fields */}
                            {(watchDeliveryMode === "DIGITAL" || watchDeliveryMode === "BOTH") && (
                                <div className="space-y-4 pt-4 border-t animate-in slide-in-from-top-2">
                                    <h4 className="font-medium flex items-center gap-2 text-slate-800">
                                        <Mail className="h-4 w-4" /> Digital Delivery Details
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Input
                                                {...form.register("shippingEmail")}
                                                placeholder="Email Address *"
                                                type="email"
                                                className={errors.shippingEmail && "border-red-500"}
                                            />
                                            {errors.shippingEmail && <p className="text-red-500 text-xs mt-1">{errors.shippingEmail.message}</p>}
                                        </div>
                                        <div>
                                            <Input
                                                {...form.register("shippingMobile")}
                                                placeholder="WhatsApp Number *"
                                                maxLength={10}
                                                className={errors.shippingMobile && "border-red-500"}
                                            />
                                            {errors.shippingMobile && <p className="text-red-500 text-xs mt-1">{errors.shippingMobile.message}</p>}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                                        You will receive the E-Stamp PDF on this email and WhatsApp.
                                    </p>
                                </div>
                            )}

                            {/* Shipping Address (Conditional) */}
                            {(watchDeliveryMode === 'PHYSICAL' || watchDeliveryMode === 'BOTH') && (
                                <div className="space-y-4 pt-4 border-t animate-in slide-in-from-top-2">
                                    <h4 className="font-medium flex items-center gap-2 text-slate-800">
                                        <MapPin className="h-4 w-4" /> Shipping Address
                                    </h4>

                                    {/* Shipping Address Type Radio */}
                                    <RadioGroup
                                        value={watchShippingType}
                                        onValueChange={(v: any) => handleShippingTypeChange(v)}
                                        className="flex flex-wrap gap-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="FIRST_PARTY" id="ship_first" />
                                            <Label htmlFor="ship_first" className="cursor-pointer">Same as First Party</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="SECOND_PARTY" id="ship_second" />
                                            <Label htmlFor="ship_second" className="cursor-pointer">Same as Second Party</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="NEW" id="ship_new" />
                                            <Label htmlFor="ship_new" className="cursor-pointer">Add New Address</Label>
                                        </div>
                                    </RadioGroup>
                                    {errors.shippingAddressType && <p className="text-xs text-red-500">{errors.shippingAddressType.message}</p>}

                                    {/* Shipping Details Form (Shown if any option selected) */}
                                    {watchShippingType && (
                                        <div className="grid gap-4 pt-2 bg-slate-50/50 p-4 rounded-lg border border-slate-100">
                                            <Input
                                                {...form.register("shippingAddress.name")}
                                                placeholder="Recipient Name *"
                                                readOnly={isShippingReadOnly}
                                                className={isShippingReadOnly ? "bg-slate-100 text-slate-500" : (errors.shippingAddress?.name && "border-red-500")}
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    {...form.register("shippingAddress.mobile")}
                                                    placeholder="Mobile Number *"
                                                    readOnly={isShippingReadOnly}
                                                    className={isShippingReadOnly ? "bg-slate-100 text-slate-500" : (errors.shippingAddress?.mobile && "border-red-500")}
                                                />
                                                <Input
                                                    {...form.register("shippingAddress.pincode")}
                                                    placeholder="Pincode *"
                                                    readOnly={isShippingReadOnly}
                                                    onChange={(e) => {
                                                        if (isShippingReadOnly) return;
                                                        const val = e.target.value;
                                                        setValue("shippingAddress.pincode", val);
                                                        handlePincodeLookup(val, "shippingAddress");
                                                    }}
                                                    maxLength={6}
                                                    className={isShippingReadOnly ? "bg-slate-100 text-slate-500" : (errors.shippingAddress?.pincode && "border-red-500")}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    {...form.register("shippingAddress.city")}
                                                    placeholder="City"
                                                    readOnly
                                                    className="bg-slate-100 text-slate-500"
                                                />
                                                <Input
                                                    {...form.register("shippingAddress.state")}
                                                    placeholder="State"
                                                    readOnly
                                                    className="bg-slate-100 text-slate-500"
                                                />
                                            </div>
                                            <Textarea
                                                {...form.register("shippingAddress.address")}
                                                placeholder="Complete Address *"
                                                readOnly={isShippingReadOnly}
                                                className={isShippingReadOnly ? "bg-slate-100 text-slate-500" : (errors.shippingAddress?.address && "border-red-500")}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* --- Right Column: Parties --- */}
                <div className="space-y-8">
                    {/* First Party */}
                    <Card>
                        <CardHeader className="pb-4 border-b bg-slate-50/50">
                            <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                                <User className="h-4 w-4" /> First Party (Purchaser)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>Full Name <span className="text-red-500">*</span></Label>
                                <Input {...form.register("firstParty.name")} placeholder="Full Name" className={errors.firstParty?.name && "border-red-500"} />
                                {errors.firstParty?.name && <p className="text-xs text-red-500">{errors.firstParty.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Father/Husband Name</Label>
                                <Input {...form.register("firstParty.relationName")} placeholder="Father/Husband Name" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Mobile Number <span className="text-red-500">*</span></Label>
                                    <Input {...form.register("firstParty.mobile")} placeholder="Mobile" className={errors.firstParty?.mobile && "border-red-500"} />
                                    {errors.firstParty?.mobile && <p className="text-xs text-red-500">{errors.firstParty.mobile.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>PAN Number</Label>
                                    <Input
                                        {...form.register("firstParty.pan")}
                                        placeholder="PAN Number"
                                        className={`uppercase ${errors.firstParty?.pan && "border-red-500"}`}
                                        maxLength={10}
                                    />
                                    {errors.firstParty?.pan && <p className="text-xs text-red-500">{errors.firstParty.pan.message}</p>}
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>Pincode <span className="text-red-500">*</span></Label>
                                        <Input
                                            {...form.register("firstParty.pincode")}
                                            placeholder="Pincode"
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setValue("firstParty.pincode", val);
                                                handlePincodeLookup(val, "firstParty");
                                            }}
                                            maxLength={6}
                                            className={errors.firstParty?.pincode && "border-red-500"}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>City</Label>
                                        <Input {...form.register("firstParty.city")} placeholder="City" readOnly className="bg-slate-100" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>State</Label>
                                        <Input {...form.register("firstParty.state")} placeholder="State" readOnly className="bg-slate-100" />
                                    </div>
                                </div>
                                {errors.firstParty?.pincode && <p className="text-xs text-red-500">{errors.firstParty.pincode.message}</p>}

                                <div className="space-y-2">
                                    <Label>Address <span className="text-red-500">*</span></Label>
                                    <Textarea {...form.register("firstParty.address")} placeholder="Full Address" className={errors.firstParty?.address && "border-red-500"} />
                                    {errors.firstParty?.address && <p className="text-xs text-red-500">{errors.firstParty.address.message}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Second Party */}
                    <Card>
                        <CardHeader className="pb-4 border-b bg-slate-50/50">
                            <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                                <User className="h-4 w-4" /> Second Party
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>Full Name <span className="text-red-500">*</span></Label>
                                <Input {...form.register("secondParty.name")} placeholder="Full Name" className={errors.secondParty?.name && "border-red-500"} />
                                {errors.secondParty?.name && <p className="text-xs text-red-500">{errors.secondParty.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Father/Husband Name</Label>
                                <Input {...form.register("secondParty.relationName")} placeholder="Father/Husband Name" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Mobile Number <span className="text-red-500">*</span></Label>
                                    <Input {...form.register("secondParty.mobile")} placeholder="Mobile" className={errors.secondParty?.mobile && "border-red-500"} />
                                    {errors.secondParty?.mobile && <p className="text-xs text-red-500">{errors.secondParty.mobile.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>PAN Number</Label>
                                    <Input
                                        {...form.register("secondParty.pan")}
                                        placeholder="PAN Number"
                                        className={`uppercase ${errors.secondParty?.pan && "border-red-500"}`}
                                        maxLength={10}
                                    />
                                    {errors.secondParty?.pan && <p className="text-xs text-red-500">{errors.secondParty.pan.message}</p>}
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>Pincode <span className="text-red-500">*</span></Label>
                                        <Input
                                            {...form.register("secondParty.pincode")}
                                            placeholder="Pincode"
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setValue("secondParty.pincode", val);
                                                handlePincodeLookup(val, "secondParty");
                                            }}
                                            maxLength={6}
                                            className={errors.secondParty?.pincode && "border-red-500"}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>City</Label>
                                        <Input {...form.register("secondParty.city")} placeholder="City" readOnly className="bg-slate-100" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>State</Label>
                                        <Input {...form.register("secondParty.state")} placeholder="State" readOnly className="bg-slate-100" />
                                    </div>
                                </div>
                                {errors.secondParty?.pincode && <p className="text-xs text-red-500">{errors.secondParty.pincode.message}</p>}

                                <div className="space-y-2">
                                    <Label>Address <span className="text-red-500">*</span></Label>
                                    <Textarea {...form.register("secondParty.address")} placeholder="Full Address" className={errors.secondParty?.address && "border-red-500"} />
                                    {errors.secondParty?.address && <p className="text-xs text-red-500">{errors.secondParty.address.message}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="flex justify-end pt-6 border-t">
                <Button size="lg" onClick={handleSubmit(onSubmit, onError)} className="w-full md:w-auto">
                    Proceed to Verification <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
