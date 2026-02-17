"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MapPin, ChevronRight, Search } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { DocumentService } from "@/modules/documents/services/document.service";
import { PincodeService } from "@/modules/documents/services/pincode.service";
import type { DocumentCategory, DocumentType } from "@/modules/documents/types/document.types";
import { createDocumentSchema, type CreateDocumentFormValues } from "@/modules/documents/constants/schemas";
import { useDocumentStore } from "@/modules/documents/store/document.store";

export function LocationStep() {
    const { formData, updateFormData, setStep, setTemplate } = useDocumentStore();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<DocumentCategory[]>([]);
    const [types, setTypes] = useState<DocumentType[]>([]);
    const [fetchingPincode, setFetchingPincode] = useState(false);

    const form = useForm<CreateDocumentFormValues>({
        resolver: zodResolver(createDocumentSchema),
        defaultValues: {
            categoryId: formData.categoryId,
            typeId: formData.typeId,
            pincode: formData.pincode,
            state: formData.state,
            district: formData.district,
            city: formData.city,
        },
    });

    // Fetch Categories on Load
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await DocumentService.getCategories();
                setCategories(data);

                // If we already have a category selected, load types
                if (formData.categoryId) {
                    loadTypes(formData.categoryId);
                }
            } catch (error) {
                toast.error("Failed to load categories. Please refresh.");
            }
        };
        loadCategories();
    }, []);

    const loadTypes = async (categoryId: string) => {
        try {
            const data = await DocumentService.getTypesByCategory(Number(categoryId));
            setTypes(data);
        } catch (error) {
            toast.error("Failed to load document types.");
        }
    }

    // Fetch Types when Category changes
    const onCategoryChange = async (categoryId: string) => {
        form.setValue("categoryId", categoryId);
        form.setValue("typeId", ""); // Reset type
        updateFormData({ categoryId: categoryId, typeId: "" });
        setTypes([]);
        await loadTypes(categoryId);
    };

    // Handle Pincode Lookup
    const onPincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, "").slice(0, 6);
        form.setValue("pincode", val);
        updateFormData({ pincode: val });

        if (val.length === 6) {
            setFetchingPincode(true);
            try {
                const data = await PincodeService.getData(val);
                if (data.Status === "Success" && data.PostOffice && data.PostOffice.length > 0) {
                    const place = data.PostOffice[0];
                    form.setValue("state", place.State);
                    form.setValue("district", place.District);
                    form.setValue("city", place.Block === "NA" ? place.Name : place.Block);

                    updateFormData({
                        state: place.State,
                        district: place.District,
                        city: place.Block === "NA" ? place.Name : place.Block
                    });

                    toast.success(`Location found: ${place.District}, ${place.State}`);
                } else {
                    toast.error("Invalid Pincode or no data found.");
                    // Reset location fields
                    const resetLoc = { state: "", district: "", city: "" };
                    form.setValue("state", "");
                    form.setValue("district", "");
                    form.setValue("city", "");
                    updateFormData(resetLoc);
                }
            } catch (error) {
                toast.error("Error fetching pincode details.");
            } finally {
                setFetchingPincode(false);
            }
        }
    };

    // Sync other fields to store on change
    // We do this so if user navigates back, data is preserved
    const onTypeChange = (val: string) => {
        form.setValue("typeId", val);
        updateFormData({ typeId: val });
    }


    const onSubmit = async (values: CreateDocumentFormValues) => {
        setLoading(true);
        updateFormData(values); // Ensure store is up to date

        try {
            // Generate/Fetch Template
            const templateData = await DocumentService.generateTemplate({
                document_type_id: Number(values.typeId),
                state: values.state
            });

            setTemplate(templateData);
            setStep(2); // Move to Details Step
            toast.success("Template generated successfully!");

        } catch (error: any) {
            console.error("Template Generation Error:", error);
            toast.error(error.message || "Failed to generate document template.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl mx-auto"
        >
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4 border-b bg-slate-50/50 rounded-t-xl px-8 pt-6">
                    <CardTitle className="text-xl text-primary flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Location & Type
                    </CardTitle>
                    <CardDescription className="text-base">
                        Select the document category and tell us where you are located for state-specific laws.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                            {/* Category & Type Group */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-700 font-medium">Document Category</FormLabel>
                                            <Select onValueChange={onCategoryChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-12 bg-white border-slate-200 focus:ring-primary/20 hover:border-primary/50 transition-colors">
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories.map((cat) => (
                                                        <SelectItem key={cat.id} value={cat.id.toString()}>
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="typeId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-700 font-medium">Document Type</FormLabel>
                                            <Select onValueChange={onTypeChange} value={field.value} disabled={!form.getValues("categoryId")}>
                                                <FormControl>
                                                    <SelectTrigger className="h-12 bg-white border-slate-200 focus:ring-primary/20 hover:border-primary/50 transition-colors disabled:opacity-50">
                                                        <SelectValue placeholder="Select document type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {types.map((t) => (
                                                        <SelectItem key={t.id} value={t.id.toString()}>
                                                            {t.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Location Group */}
                            <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 space-y-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <MapPin className="h-4 w-4 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-slate-800">Your Location</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="pincode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700 font-medium">Pincode</FormLabel>
                                                <FormControl>
                                                    <div className="relative group">
                                                        <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                                        <Input
                                                            placeholder="Enter 6-digit Pincode"
                                                            className="pl-10 h-11 bg-white border-slate-200 focus-visible:ring-primary/20"
                                                            {...field}
                                                            onChange={onPincodeChange}
                                                            maxLength={6}
                                                        />
                                                        {fetchingPincode && (
                                                            <Loader2 className="absolute right-3 top-3.5 h-4 w-4 animate-spin text-primary" />
                                                        )}
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700 font-medium">City / Block</FormLabel>
                                                <FormControl>
                                                    <Input readOnly className="h-11 bg-slate-100 text-slate-600 border-slate-200 cursor-not-allowed font-medium" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="district"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700 font-medium">District</FormLabel>
                                                <FormControl>
                                                    <Input readOnly className="h-11 bg-slate-100 text-slate-600 border-slate-200 cursor-not-allowed font-medium" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="state"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700 font-medium">State</FormLabel>
                                                <FormControl>
                                                    <Input readOnly className="h-11 bg-slate-100 text-slate-600 border-slate-200 cursor-not-allowed font-medium" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                                disabled={loading}
                            >
                                {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                Proceed to Details <ChevronRight className="ml-2 h-5 w-5" />
                            </Button>

                        </form>
                    </Form>
                </CardContent>
            </Card>
        </motion.div>
    );
}
