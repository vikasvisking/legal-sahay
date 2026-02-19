export interface EStampFormData {
    stateId: string;
    stateName?: string; // Added for display
    articleId: string; // "Affidavit", "Agreement", etc.
    articleName?: string; // Added for display
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

// Order Payload Interfaces
export interface OrderParty {
    party_type: "FIRST_PARTY" | "SECOND_PARTY";
    name: string;
    relation_name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    identity_number: string; // PAN
}

export interface OrderShippingAddress {
    receiver_name: string;
    contact_number: string;
    address_line: string;
    pincode: string;
    city: string;
    state: string;
}

export interface OrderPayload {
    service_type: "ESTAMP";
    delivery_type: "DIGITAL" | "PHYSICAL" | "BOTH"; // Updated to match union
    delivery_email?: string;
    delivery_mobile?: string;
    state: number;
    article: number;
    document_reason: string;
    consideration_price: string;
    stamp_amount: string;
    service_fee: string;
    shipping_fee: string;
    parties: OrderParty[];
    shipping_address?: OrderShippingAddress;
}
