import { axiosInstance } from "@/lib/axios";
import { DOCUMENT_URLS } from "../constants/urls";
import type { DocumentCategory, DocumentType } from "../types/document.types";

export const DocumentService = {
    getCategories: async (): Promise<DocumentCategory[]> => {
        try {
            const response = await axiosInstance.get(DOCUMENT_URLS.CATEGORIES);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || "Failed to fetch categories");
        }
    },

    getTypesByCategory: async (categoryId: number): Promise<DocumentType[]> => {
        try {
            const response = await axiosInstance.get(DOCUMENT_URLS.TYPES, {
                params: { category: categoryId }
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || "Failed to fetch document types");
        }
    },

    generateTemplate: async (payload: { document_type_id: number; state: string }) => {
        try {
            const response = await axiosInstance.post(`${DOCUMENT_URLS.TEMPLATES}/generate/`, payload);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || "Failed to generate template");
        }
    },

    getAllTypes: async (): Promise<DocumentType[]> => {
        try {
            const response = await axiosInstance.get(DOCUMENT_URLS.TYPES);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || "Failed to fetch document types");
        }
    }
};
