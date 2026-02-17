"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { FileEdit, ChevronLeft, Eye, X } from "lucide-react";
import DOMPurify from 'dompurify';

import { useDocumentStore } from "@/modules/documents/store/document.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have this
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Helper to generate Zod schema from backend schema
const generateSchema = (fields: any[]) => {
    const schemaMap: any = {};
    fields.forEach((field) => {
        let validator = z.string().min(1, { message: `${field.label} is required` });
        if (field.type === "number") {
            // Basic number validation ensuring it's a string that can be parsed, or direct number
            // Input type="number" returns a string usually in HTML forms managed by RHF unless valueAsNumber is used
            schemaMap[field.key] = validator;
        } else if (field.type === "date") {
            schemaMap[field.key] = validator;
        } else {
            schemaMap[field.key] = validator;
        }
    });
    return z.object(schemaMap);
};

export function DetailsStep() {
    const { setStep, template, formData, updateFormData } = useDocumentStore();
    const [previewHtml, setPreviewHtml] = useState(template?.contentHtml || "");
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    console.log(template, 'template')

    // 1. Generate Schema based on template
    const formSchema = template?.form_schema || [];
    const DynamicSchema = generateSchema(formSchema);
    type DynamicFormValues = z.infer<typeof DynamicSchema>;

    const form = useForm<DynamicFormValues>({
        resolver: zodResolver(DynamicSchema),
        defaultValues: formData.dynamicData || {}, // Load saved data if any
    });

    // 2. Watch for changes to update Preview
    const watchedValues = useWatch({ control: form.control });

    useEffect(() => {
        if (!template?.content_html) return;

        let updatedHtml = template.content_html;

        // Replace placeholders {{{{key}}}} with values
        Object.entries(watchedValues).forEach(([key, value]) => {
            if (value) {
                // Global replace for the placeholder
                // The placeholder format from backend seems to be {{{{key}}}} based on previous artifacts
                // We need to match exactly what the backend sends.
                // Regex to match {{{{key}}}} literally
                const regex = new RegExp(`{{{{${key}}}}}`, "g");
                updatedHtml = updatedHtml.replace(regex, `<span class="highlight">${value}</span>`);
            }
        });

        // Also clean up any remaining placeholders if needed, or leave them blank
        // For now, let's keep them so user knows what's missing, or maybe style them red?

        setPreviewHtml(updatedHtml);

        // Debounce saving to store? For now just save on submit or unmount could optionally do it here
        // updateFormData({ dynamicData: watchedValues }); 
    }, [watchedValues, template?.content_html]);


    const onSubmit = (values: DynamicFormValues) => {
        console.log("Form Values:", values);
        updateFormData({ dynamicData: values });
        setStep(3); // Move to Review
    };

    if (!template) {
        return <div className="text-center p-10 text-red-500">Error: No template found. Please go back.</div>;
    }

    console.log(formSchema, 'formSchema')

    return (
        <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto h-[calc(100vh-200px)]">

            {/* LEFT: Dynamic Form (Scrollable) */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full lg:w-1/2 flex flex-col h-full"
            >
                <Card className="flex-1 flex flex-col border-none shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="pb-4 border-b bg-slate-50/50 px-6 pt-6 shrink-0">
                        <CardTitle className="text-xl text-primary flex items-center gap-2">
                            <FileEdit className="h-5 w-5" />
                            Document Details
                        </CardTitle>
                        <CardDescription>
                            Fill in the details to generate your {formData.state} agreement.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                        <Form {...form}>
                            <form id="details-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                                {formSchema.map((field) => (
                                    <FormField
                                        key={field.key}
                                        control={form.control}
                                        name={field.key}
                                        render={({ field: formField }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700 font-medium">
                                                    {field.label} <span className="text-red-500">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    {field.type === "textarea" ? (
                                                        <Textarea
                                                            placeholder={field.placeholder}
                                                            className="min-h-[80px] bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                                            {...formField}
                                                            value={formField.value as string || ""}
                                                        />
                                                    ) : (
                                                        <Input
                                                            type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
                                                            placeholder={field.placeholder}
                                                            className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                                            {...formField}
                                                            value={formField.value as string || ""}
                                                        />
                                                    )}
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}

                            </form>
                        </Form>
                    </CardContent>

                    <div className="p-4 border-t bg-slate-50/50 gap-4 flex shrink-0">
                        <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                            <ChevronLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                            <DialogTrigger asChild>
                                <Button variant="secondary" className="lg:hidden flex-1">
                                    <Eye className="mr-2 h-4 w-4" /> Preview
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Document Preview</DialogTitle>
                                </DialogHeader>
                                <div
                                    className="prose max-w-none p-4 bg-white border shadow-sm text-sm"
                                    dangerouslySetInnerHTML={{ __html: typeof window !== 'undefined' ? DOMPurify.sanitize(previewHtml) : previewHtml }}
                                />
                            </DialogContent>
                        </Dialog>
                        <Button type="submit" form="details-form" className="flex-1">
                            Save & Continue
                        </Button>
                    </div>
                </Card>
            </motion.div>

            {/* RIGHT: Live Preview (Desktop Only) */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden lg:flex w-1/2 h-full flex-col"
            >
                <Card className="flex-1 flex flex-col border-none shadow-xl bg-slate-800/95 backdrop-blur-sm overflow-hidden text-slate-100">
                    <CardHeader className="pb-4 border-b border-slate-700 px-6 pt-6 shrink-0 flex flex-row justify-between items-center">
                        <div>
                            <CardTitle className="text-xl flex items-center gap-2 text-slate-100">
                                <Eye className="h-5 w-5 text-secondary" />
                                Live Preview
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                See your document update in real-time.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 overflow-hidden flex-1 relative bg-slate-200">
                        {/* Scale render to fit if needed, or just scroll */}
                        <div className="w-full h-full overflow-y-auto p-8 custom-scrollbar">
                            <div
                                className="bg-white text-black p-8 shadow-lg min-h-[1000px] origin-top mx-auto"
                                style={{ width: '210mm', maxWidth: '100%' }} // A4 width
                                dangerouslySetInnerHTML={{ __html: typeof window !== 'undefined' ? DOMPurify.sanitize(previewHtml) : previewHtml }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

        </div>
    );
}
