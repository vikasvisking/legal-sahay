export interface DocumentCategory {
    id: number;
    name: string;
    slug: string;
    description: string;
    icon?: string;
}

export interface DocumentType {
    id: number;
    name: string;
    slug: string;
    description: string;
    category: number; // ID of the category
}

export interface PincodeResponse {
    Message: string;
    Status: "Success" | "Error";
    PostOffice: PostOffice[] | null;
}

export interface PostOffice {
    Name: string;
    Description: string | null;
    BranchType: string;
    DeliveryStatus: string;
    Circle: string;
    District: string;
    Division: string;
    Region: string;
    Block: string;
    State: string;
    Country: string;
    Pincode: string;
}
