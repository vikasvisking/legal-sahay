export interface EStampFormData {
    stateId: string;
    articleId: string; // "Affidavit", "Agreement", etc.
    description: string;
    considerationPrice: string;
    firstParty: PartyDetails;
    secondParty: PartyDetails;
    stampDutyAmount: string;
    stampDutyPaidBy: 'FIRST_PARTY' | 'SECOND_PARTY';
    stampDutyPaidByGender: 'MALE' | 'FEMALE' | 'OTHER';
    deliveryMode: 'PHYSICAL' | 'DIGITAL' | 'BOTH';
    shippingAddressType: 'FIRST_PARTY' | 'SECOND_PARTY' | 'NEW';
    shippingAddress?: PartyDetails; // Reuse PartyDetails for address structure
    shippingEmail?: string;
    shippingMobile?: string;
}

export interface PartyDetails {
    name: string;
    relationName: string; // Father/Husband Name
    address: string;
    pincode: string;
    city: string;
    state: string;
    pan: string; // PAN/Aadhaar
    mobile: string;
    email?: string;
}

export interface EStampState {
    currentStep: number;
    steps: { id: number; title: string; isCompleted: boolean }[];
    formData: EStampFormData;

    // Fees
    fees: {
        stampDuty: number;
        serviceFee: number;
        deliveryFee: number;
        total: number;
    };

    setStep: (step: number) => void;
    updateFormData: (data: Partial<EStampFormData>) => void;
    updatePartyDetails: (party: 'firstParty' | 'secondParty', data: Partial<PartyDetails>) => void;
    calculateFees: () => void; // Mock for now or hit API
    resetStore: () => void;
}
