"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, ChevronLeft, Save, Plus, Trash2, ArrowRight } from "lucide-react";
import DOMPurify from 'dompurify';

import { useDocumentStore } from "@/modules/documents/store/document.store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export function ReviewStep() {
    const { setStep, template, formData, addCustomClause, removeCustomClause } = useDocumentStore();
    const [previewHtml, setPreviewHtml] = useState(template?.content_html || "");
    const [clauseType, setClauseType] = useState<"clause" | "section">("clause");
    const [customTitle, setCustomTitle] = useState("");
    const [customContent, setCustomContent] = useState("");

    // Save Draft State
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
    const [documentName, setDocumentName] = useState("");

    // 1. Inject content into HTML
    useEffect(() => {
        if (!template?.content_html) return;

        let updatedHtml = template.content_html;

        // A. Inject Dynamic Values (Same as DetailsStep)
        Object.entries(formData.dynamicData || {}).forEach(([key, value]) => {
            if (value) {
                const regex = new RegExp(`{{{{${key}}}}}`, "g");
                updatedHtml = updatedHtml.replace(regex, `<span class="highlight">${value}</span>`);
            }
        });

        // B. Generate HTML for Custom Clauses
        let customHtml = "";
        const clauses = formData.customClauses || [];

        if (clauses.length > 0) {
            customHtml += `<div class="custom-added-content" style="margin-top: 20px; margin-bottom: 20px;">`;
            clauses.forEach(clause => {
                if (clause.type === 'section') {
                    customHtml += `<div class="section-title" style="font-weight: bold; text-decoration: underline; margin-top: 16px; margin-bottom: 8px; font-size: 11pt;">${clause.title || 'Untitled Section'}</div>`;
                    customHtml += `<div class="clause" style="text-align: justify; margin-bottom: 8px; line-height: 1.5;">${clause.content.replace(/\n/g, "<br/>")}</div>`;
                } else {
                    // It's a clause
                    customHtml += `<div class="clause" style="text-align: justify; margin-bottom: 8px; line-height: 1.5;">${clause.content.replace(/\n/g, "<br/>")}</div>`;
                }
            });
            customHtml += `</div>`;
        }

        // C. Clean up raw HTML
        updatedHtml = updatedHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
        updatedHtml = updatedHtml.replace(/<!DOCTYPE html>/gi, "");
        updatedHtml = updatedHtml.replace(/<\/?html[^>]*>/gi, "");
        updatedHtml = updatedHtml.replace(/<\/?head[^>]*>/gi, "");
        updatedHtml = updatedHtml.replace(/<\/?body[^>]*>/gi, "");
        updatedHtml = updatedHtml.replace(/\n+/g, "<br />");

        // D. Inject Custom Content BEFORE the signature section
        // We look for the signature section div and insert before it. 
        // If not found, we append to end.
        if (customHtml) {
            if (updatedHtml.includes('class="signature-section"')) {
                updatedHtml = updatedHtml.replace('<div class="signature-section"', `${customHtml}<div class="signature-section"`);
            } else if (updatedHtml.includes("class='signature-section'")) {
                updatedHtml = updatedHtml.replace("<div class='signature-section'", `${customHtml}<div class='signature-section'`);
            } else {
                // Fallback: Append at the end of the container if possible, 
                // but since we stripped body tags, it's just a string. 
                updatedHtml += customHtml;
            }
        }

        setPreviewHtml(updatedHtml);

    }, [formData.dynamicData, formData.customClauses, template?.content_html]);

    const handleAddClause = () => {
        if (!customContent.trim()) {
            toast.error("Content cannot be empty");
            return;
        }
        if (clauseType === 'section' && !customTitle.trim()) {
            toast.error("Section title is required");
            return;
        }

        addCustomClause({
            type: clauseType,
            title: clauseType === 'section' ? customTitle : undefined,
            content: customContent
        });

        // Reset
        setCustomContent("");
        setCustomTitle("");
        toast.success(`${clauseType === 'section' ? 'Section' : 'Clause'} added`);
    };

    const handleSaveDraft = () => {
        if (!documentName.trim()) return;

        // Mock API Call
        console.log("Saving Draft:", {
            name: documentName,
            formData: formData
        });

        toast.success("Document saved as draft!");
        setIsSaveDialogOpen(false);
    };

    if (!template) return null;

    return (
        <div className="grid lg:grid-cols-12 gap-8 w-full items-start">
            {/* LEFT: Customization & Review */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="col-span-12 lg:col-span-5 flex flex-col gap-6"
            >
                <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-4 border-b bg-slate-50/50 px-6 pt-6">
                        <CardTitle className="text-xl text-primary flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Review & Customize
                        </CardTitle>
                        <CardDescription>
                            Review your document and add any specific clauses if needed.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-6 space-y-6">

                        {/* Adder Section */}
                        <div className="space-y-4 p-4 bg-slate-50 rounded-lg border">
                            <h3 className="text-sm font-semibold text-slate-800">Add Additional Content</h3>

                            <RadioGroup value={clauseType} onValueChange={(v) => setClauseType(v as "clause" | "section")} className="flex gap-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="clause" id="r-clause" />
                                    <Label htmlFor="r-clause">Single Clause</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="section" id="r-section" />
                                    <Label htmlFor="r-section">New Section</Label>
                                </div>
                            </RadioGroup>

                            {clauseType === 'section' && (
                                <div className="space-y-2">
                                    <Label>Section Title</Label>
                                    <Input
                                        placeholder="e.g. Terms of Termination"
                                        value={customTitle}
                                        onChange={(e) => setCustomTitle(e.target.value)}
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label>{clauseType === 'section' ? 'Section Content' : 'Clause Content'}</Label>
                                <Textarea
                                    placeholder="Enter the legal text here..."
                                    className="min-h-[100px]"
                                    value={customContent}
                                    onChange={(e) => setCustomContent(e.target.value)}
                                />
                            </div>

                            <Button onClick={handleAddClause} size="sm" className="w-full">
                                <Plus className="h-4 w-4 mr-2" />
                                Add to Document
                            </Button>
                        </div>

                        {/* List of Added Clauses */}
                        {(formData.customClauses || []).length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-slate-800">Added Custom Content</h3>
                                    <span className="text-xs text-muted-foreground">{formData.customClauses?.length} item(s)</span>
                                </div>

                                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                    {formData.customClauses?.map((item, idx) => (
                                        <div key={item.id} className="p-3 bg-white border rounded text-sm relative group">
                                            <div className="pr-6">
                                                {item.type === 'section' && (
                                                    <p className="font-bold text-slate-800 mb-1">{item.title}</p>
                                                )}
                                                <p className="text-slate-600 line-clamp-3">{item.content}</p>
                                            </div>
                                            <button
                                                onClick={() => removeCustomClause(item.id)}
                                                className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </CardContent>

                    <div className="p-4 border-t bg-slate-50/50 gap-4 flex shrink-0">
                        <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                            <ChevronLeft className="mr-2 h-4 w-4" /> Edit Details
                        </Button>

                        <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="secondary" className="flex-1">
                                    <Save className="mr-2 h-4 w-4" /> Save Draft
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Save as Draft</DialogTitle>
                                    <DialogDescription>
                                        Give your document a name to save it for later.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                    <Label>Document Name</Label>
                                    <Input
                                        placeholder="My Rental Agreement"
                                        value={documentName}
                                        onChange={(e) => setDocumentName(e.target.value)}
                                    />
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleSaveDraft}>Save</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Button onClick={() => setStep(4)} className="flex-1">
                            Proceed <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </Card>
            </motion.div>

            {/* RIGHT: Live Preview */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden lg:flex col-span-12 lg:col-span-7 flex-col sticky top-24 h-[calc(100vh-120px)]"
            >
                <div className="flex-1 flex flex-col bg-slate-200/50 rounded-xl border border-slate-200 shadow-inner overflow-hidden backdrop-blur-sm relative">
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex justify-center items-start">
                        <div
                            className="bg-white text-black shadow-lg origin-top transition-all duration-300 print-content"
                            style={{
                                width: '210mm',
                                minHeight: '297mm',
                                padding: '10mm',
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

                                /* Custom content specific styles are inline or inherited */
                            `}</style>
                            <div dangerouslySetInnerHTML={{ __html: typeof window !== 'undefined' ? DOMPurify.sanitize(previewHtml) : previewHtml }} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
