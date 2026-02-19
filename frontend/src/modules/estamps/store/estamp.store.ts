import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { EStampState, EStampFormData, PartyDetails } from '../types/estamp.types';

const INITIAL_PARTY: PartyDetails = {
    name: '',
    relationName: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
    pan: '',
    mobile: ''
};

const INITIAL_FORM_DATA: EStampFormData = {
    stateId: '',
    stateName: '',
    articleId: '',
    articleName: '',
    description: '',
    considerationPrice: '',
    stampDutyAmount: '',
    firstParty: { ...INITIAL_PARTY },
    secondParty: { ...INITIAL_PARTY },
    stampDutyPaidBy: 'FIRST_PARTY',
    stampDutyPaidByGender: 'MALE',
    deliveryMode: 'DIGITAL',
    shippingAddressType: 'FIRST_PARTY',
    shippingAddress: { ...INITIAL_PARTY },
    shippingEmail: '',
    shippingMobile: ''
};

interface EStampStore extends EStampState {
    setStep: (step: number) => void;
    updateFormData: (data: Partial<EStampFormData>) => void;
    updatePartyDetails: (party: 'firstParty' | 'secondParty', data: Partial<PartyDetails>) => void;
    updateShippingAddress: (data: Partial<PartyDetails>) => void;
    calculateFees: () => void;
    resetStore: () => void;
}

export const useEStampStore = create<EStampStore>()(
    devtools(
        persist(
            (set, get) => ({
                currentStep: 1,
                steps: [
                    { id: 1, title: 'Details', isCompleted: false },
                    { id: 2, title: 'Verification', isCompleted: false },
                    { id: 3, title: 'Payment', isCompleted: false },
                ],
                formData: INITIAL_FORM_DATA,
                fees: {
                    stampDuty: 0,
                    serviceFee: 0,
                    deliveryFee: 0,
                    total: 0
                },

                setStep: (step) => set({ currentStep: step }),

                updateFormData: (data) => set((state) => ({
                    formData: { ...state.formData, ...data }
                })),

                updatePartyDetails: (party, data) => set((state) => ({
                    formData: {
                        ...state.formData,
                        [party]: { ...state.formData[party], ...data }
                    }
                })),

                updateShippingAddress: (data) => set((state) => ({
                    formData: {
                        ...state.formData,
                        shippingAddress: { ...(state.formData.shippingAddress || INITIAL_PARTY), ...data }
                    }
                })),

                calculateFees: () => {
                    const price = parseFloat(get().formData.considerationPrice) || 0;
                    const stampAmount = parseFloat(get().formData.stampDutyAmount) || 0;

                    // Stamp Duty: User input takes precedence, else fallback logic (though UI enforces input)
                    const stampDuty = stampAmount > 0 ? stampAmount : (price > 0 ? Math.max(100, price * 0.05) : 0);

                    const serviceFee = 50; // Fixed Service Fee
                    const deliveryFee = get().formData.deliveryMode === 'PHYSICAL' ? 50 : 0;

                    set({
                        fees: {
                            stampDuty,
                            serviceFee,
                            deliveryFee,
                            total: stampDuty + serviceFee + deliveryFee
                        }
                    });
                },

                resetStore: () => set({
                    currentStep: 1,
                    formData: INITIAL_FORM_DATA,
                    fees: { stampDuty: 0, serviceFee: 0, deliveryFee: 0, total: 0 }
                })
            }),
            {
                name: 'estamp-storage',
            }
        )
    )
);
