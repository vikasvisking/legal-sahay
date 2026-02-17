import * as z from "zod";

export const createDocumentSchema = z.object({
    categoryId: z.string().min(1, "Please select a category"),
    typeId: z.string().min(1, "Please select a document type"),
    pincode: z.string().length(6, "Pincode must be exactly 6 digits").regex(/^\d+$/, "Must be numbers only"),
    state: z.string().min(1, "State is required"),
    district: z.string().min(1, "District is required"),
    city: z.string().min(1, "City/Block is required"),
});

export type CreateDocumentFormValues = z.infer<typeof createDocumentSchema>;
