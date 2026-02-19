import * as z from "zod";

export const phoneRegex = /^[6-9]\d{9}$/;
export const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
export const pincodeRegex = /^[1-9][0-9]{5}$/;

export const partySchema = z.object({
    name: z.string().min(3, "Name is required (min 3 chars)"),
    relationName: z.string().optional(),
    mobile: z.string().regex(phoneRegex, "Invalid Indian mobile number"),
    pan: z.string().regex(panRegex, "Invalid PAN Number").or(z.literal("")), // PAN is optional in general schema, but enforced for payer
    pincode: z.string().regex(pincodeRegex, "Invalid Pincode"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    address: z.string().min(5, "Address must be at least 5 chars"),
});

// Strict schema for validation when Physical delivery is active
const strictShippingSchema = z.object({
    name: z.string().min(3, "Recipient Name is required"),
    mobile: z.string().regex(phoneRegex, "Invalid mobile number"),
    pincode: z.string().regex(pincodeRegex, "Invalid Pincode"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    address: z.string().min(5, "Address must be at least 5 chars"),
});

// Relaxed schema for form structure (allows empty values when hidden)
export const shippingSchema = z.object({
    name: z.string().optional(),
    mobile: z.string().optional(),
    pincode: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    address: z.string().optional(),
});

export const formSchema = z.object({
    stateId: z.string().min(1, "State is required"),
    articleId: z.string().min(1, "Article is required"),
    description: z.string().min(10, "Description must be at least 10 chars"),
    considerationPrice: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Price cannot be negative").refine((val) => val.trim() !== "", "Price is required"), // Allow 0, reject negative

    stampDutyPaidBy: z.enum(["FIRST_PARTY", "SECOND_PARTY"]),
    stampDutyAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Amount cannot be negative").refine((val) => val.trim() !== "", "Amount is required"),
    stampDutyPaidByGender: z.enum(["MALE", "FEMALE", "OTHER"]),

    firstParty: partySchema,
    secondParty: partySchema,

    deliveryMode: z.enum(["DIGITAL", "PHYSICAL", "BOTH"]),
    shippingAddressType: z.enum(["FIRST_PARTY", "SECOND_PARTY", "NEW"]).optional(),
    shippingAddress: shippingSchema.optional(), // Uses relaxed schema
    shippingEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
    shippingMobile: z.string().regex(phoneRegex, "Invalid mobile number").optional().or(z.literal("")),
}).superRefine((data, ctx) => {
    // 1. Enforce PAN for the Payer
    const payer = data.stampDutyPaidBy === "FIRST_PARTY" ? data.firstParty : data.secondParty;
    if (!payer.pan || !panRegex.test(payer.pan)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "PAN is mandatory for the party paying Stamp Duty",
            path: [data.stampDutyPaidBy === "FIRST_PARTY" ? "firstParty" : "secondParty", "pan"],
        });
    }

    // 2. Delivery Mode Validation
    if (data.deliveryMode === "PHYSICAL" || data.deliveryMode === "BOTH") {
        // Physical Delivery Logic
        if (!data.shippingAddressType) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Please select a shipping address option",
                path: ["shippingAddressType"],
            });
        }

        // Deep validate shipping address using strict schema
        const result = strictShippingSchema.safeParse(data.shippingAddress);
        if (!result.success) {
            result.error.issues.forEach((issue) => {
                ctx.addIssue({
                    ...issue,
                    path: ["shippingAddress", ...issue.path],
                });
            });
        }
    }

    if (data.deliveryMode === "DIGITAL" || data.deliveryMode === "BOTH") {
        // Digital Delivery Logic
        if (!data.shippingEmail) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Email is required for digital delivery",
                path: ["shippingEmail"],
            });
        }
        if (!data.shippingMobile) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Mobile number is required for digital delivery",
                path: ["shippingMobile"],
            });
        }
    }
});

export type FormData = z.infer<typeof formSchema>;
