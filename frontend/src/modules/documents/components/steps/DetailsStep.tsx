"use client";

import { cn } from "@/lib/utils";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { FileEdit, ChevronLeft, Eye, X, Calendar as CalendarIcon } from "lucide-react";
import DOMPurify from 'dompurify';
import { format } from "date-fns"; // Import date-fns

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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// Helper to generate Zod schema from backend schema
const generateSchema = (fields: { key: string; label: string; type: string; placeholder: string }[]) => {
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
    const [previewHtml, setPreviewHtml] = useState(template?.content_html || "");
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
                const regex = new RegExp(`{{{{${key}}}}}`, "g");
                updatedHtml = updatedHtml.replace(regex, `<span class="highlight">${value}</span>`);
            }
        });

        // Strip <style> tags and <html>/<body> wrappers to prevent style conflicts
        updatedHtml = updatedHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
        updatedHtml = updatedHtml.replace(/<!DOCTYPE html>/gi, "");
        updatedHtml = updatedHtml.replace(/<\/?html[^>]*>/gi, "");
        updatedHtml = updatedHtml.replace(/<\/?head[^>]*>/gi, "");
        updatedHtml = updatedHtml.replace(/<\/?body[^>]*>/gi, "");

        // Replace \n with <br /> for proper formatting (collapse multiple newlines to single break for compactness)
        updatedHtml = updatedHtml.replace(/\n+/g, "<br />");

        setPreviewHtml(updatedHtml);

    }, [watchedValues, template?.content_html]);


    const onSubmit = (values: DynamicFormValues) => {
        console.log("Form Values:", values);
        updateFormData({ dynamicData: values });
        setStep(3); // Move to Review
    };

    if (!template) {
        return <div className="text-center p-10 text-red-500">Error: No template found. Please go back.</div>;
    }

    return (
        <div className="grid lg:grid-cols-12 gap-8 w-full items-start">

            {/* LEFT: Dynamic Form (Natural Height) */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="col-span-12 lg:col-span-5 flex flex-col"
            >
                <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-4 border-b bg-slate-50/50 px-6 pt-6">
                        <CardTitle className="text-xl text-primary flex items-center gap-2">
                            <FileEdit className="h-5 w-5" />
                            Document Details
                        </CardTitle>
                        <CardDescription>
                            Fill in the details to generate your {formData.state} agreement.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-6">
                        <Form {...form}>
                            <form id="details-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

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
                                                            className="min-h-[120px] bg-slate-50 border-slate-200 focus:bg-white transition-colors resize-y"
                                                            {...formField}
                                                            value={formField.value as string || ""}
                                                        />
                                                    ) : field.type === "date" ? (
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <FormControl>
                                                                    <Button
                                                                        variant={"outline"}
                                                                        className={cn(
                                                                            "w-full pl-3 text-left font-normal h-12 bg-slate-50 border-slate-200 focus:bg-white transition-colors",
                                                                            !formField.value && "text-muted-foreground"
                                                                        )}
                                                                    >
                                                                        {formField.value ? (
                                                                            format(new Date(formField.value as string), "PPP")
                                                                        ) : (
                                                                            <span>Pick a date</span>
                                                                        )}
                                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                    </Button>
                                                                </FormControl>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0" align="start">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={formField.value ? new Date(formField.value as string) : undefined}
                                                                    onSelect={(date) => {
                                                                        formField.onChange(date ? format(date, "yyyy-MM-dd") : "");
                                                                    }}
                                                                    disabled={(date) =>
                                                                        date < new Date("1900-01-01")
                                                                    }
                                                                    initialFocus
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                    ) : (
                                                        <Input
                                                            type={field.type === "number" ? "number" : "text"}
                                                            placeholder={field.placeholder}
                                                            className="h-12 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
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

                    <div className="p-4 border-t bg-slate-50/50 gap-4 flex shrink-0 sticky bottom-0 z-10">
                        {/* Sticky bottom actions for the form card if needed, or just let it flow. 
                             Actually, let's keep it normal. sticky bottom might cover content if not careful.
                             User didn't ask for sticky actions, just full height form. 
                         */}
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

            {/* RIGHT: Live Preview (Desktop Only - Sticky) */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden lg:flex col-span-12 lg:col-span-7 flex-col sticky top-24 h-[calc(100vh-120px)]"
            >
                {/* Clean Document Viewer */}
                <div className="flex-1 flex flex-col bg-slate-200/50 rounded-xl border border-slate-200 shadow-inner overflow-hidden backdrop-blur-sm relative">

                    {/* Document Container */}
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex justify-center items-start">
                        <div
                            className="bg-white text-black shadow-lg origin-top transition-all duration-300 print-content"
                            style={{
                                width: '210mm',
                                minHeight: '297mm',
                                padding: '10mm', // Standard A4 margins
                                margin: '0 auto',
                            }}
                        >
                            <style jsx global>{`
                                .print-content {
                                    font-family: 'Times New Roman', Times, serif;
                                    line-height: 1.5;
                                    font-size: 11pt;
                                    color: #000;
                                    overflow-wrap: break-word;
                                }
                                .print-content .court-frame { border: 3px double #333; padding: 20px; margin-bottom: 20px; }
                                .print-content .header-stamp { border: 1px dashed #999; padding: 10px; text-align: center; color: #555; margin-bottom: 20px; font-weight: bold; font-size: 10pt; display: flex; align-items: center; justify-content: center; min-height: 60px; }
                                .print-content .document-title { text-align: center; font-weight: bold; font-size: 14pt; text-decoration: underline; margin: 20px 0; text-transform: uppercase; }
                                .print-content .section-title { font-weight: bold; text-decoration: underline; margin-top: 16px; margin-bottom: 8px; font-size: 11pt; }
                                .print-content .clause { text-align: justify; margin-bottom: 8px; line-height: 1.5; }
                                .print-content .clause-number { font-weight: bold; margin-right: 5px; }
                                .print-content .highlight { background-color: #fef08a; padding: 0 2px; }
                                
                                /* Table Styles */
                                .print-content .parties-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; table-layout: fixed; }
                                .print-content .parties-table td { padding: 4px 0; vertical-align: top; word-break: break-word; }
                                
                                /* Signature Section */
                                .print-content .signature-section { margin-top: 30px; page-break-inside: avoid; }
                                .print-content .sig-row { display: flex; justify-content: space-between; gap: 20px; margin-bottom: 20px; flex-wrap: wrap; }
                                .print-content .sig-box { width: 45%; min-width: 200px; border-top: 1px solid #000; padding-top: 8px; text-align: center; margin-bottom: 10px; }
                                
                                /* Footer */
                                .print-content .footer-note { margin-top: 30px; font-size: 8pt; color: #666; font-style: italic; border-top: 1px solid #eee; padding-top: 8px; text-align: justify; }

                                /* Custom Scrollbar for Preview */
                                .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 4px; }
                                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
                            `}</style>
                            <div dangerouslySetInnerHTML={{ __html: typeof window !== 'undefined' ? DOMPurify.sanitize(previewHtml) : previewHtml }} />
                        </div>
                    </div>
                </div>
            </motion.div>

        </div>
    );
}
