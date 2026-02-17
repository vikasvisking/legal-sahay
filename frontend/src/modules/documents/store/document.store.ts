import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DocumentCategory, DocumentType } from '../types/document.types';

interface DocumentFormData {
    // Step 1: Location & Type
    categoryId: string;
    typeId: string;
    pincode: string;
    state: string;
    district: string;
    city: string;

    // Step 2: Dynamic Form Data
    dynamicData?: Record<string, any>;
}

interface DocumentState {
    currentStep: number;
    steps: { id: number; title: string; isCompleted: boolean }[];
    formData: DocumentFormData;

    // Template Data (fetched from backend)
    template: {
        contentHtml: string;
        formSchema: any[];
    } | null;

    // Actions
    setStep: (step: number) => void;
    updateFormData: (data: Partial<DocumentFormData>) => void;
    setTemplate: (template: { contentHtml: string; formSchema: any[] } | null) => void;
    resetStore: () => void;
}

const INITIAL_STEPS = [
    { id: 1, title: "Location", isCompleted: false },
    { id: 2, title: "Details", isCompleted: false },
    { id: 3, title: "Review", isCompleted: false },
    { id: 4, title: "Payment", isCompleted: false },
];

const INITIAL_FORM_DATA: DocumentFormData = {
    categoryId: "",
    typeId: "",
    pincode: "",
    state: "",
    district: "",
    city: "",
    dynamicData: {},
};

export const useDocumentStore = create<DocumentState>()(
    persist(
        (set) => ({
            currentStep: 1,
            steps: INITIAL_STEPS,
            formData: INITIAL_FORM_DATA,
            template: null,

            setStep: (step) => set((state) => {
                const newSteps = state.steps.map((s) => ({
                    ...s,
                    isCompleted: s.id < step
                }));
                return { currentStep: step, steps: newSteps };
            }),

            updateFormData: (data) => set((state) => ({
                formData: { ...state.formData, ...data }
            })),

            setTemplate: (template) => set({ template }),

            resetStore: () => set({
                currentStep: 1,
                steps: INITIAL_STEPS,
                formData: INITIAL_FORM_DATA,
                template: null
            }),
        }),
        {
            name: 'document-storage',
            storage: createJSONStorage(() => sessionStorage), // Use sessionStorage to clear on tab close
            partialize: (state) => ({
                // Persist everything so reload works
                currentStep: state.currentStep,
                formData: state.formData,
                template: state.template,
                steps: state.steps
            }),
        }
    )
);
