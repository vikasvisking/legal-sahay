export interface User {
    id: number;
    phone_number: string;
    first_name?: string;
    last_name?: string;
    email?: string;
}

export interface AuthTokens {
    refresh: string;
    access: string;
}

export interface AuthResponse {
    message: string;
    user: User;
    tokens: AuthTokens;
}

export interface SendOtpResponse {
    message: string;
    details?: string;
    otp?: string; // For dev mode
}
