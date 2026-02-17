import { AUTH_URLS } from "../constants/urls";
import type { AuthResponse, SendOtpResponse } from "../types/auth.types";
import { axiosInstance } from "@/lib/axios";

export const AuthService = {
    sendOtp: async (phoneNumber: string): Promise<SendOtpResponse> => {
        try {
            const response = await axiosInstance.post(AUTH_URLS.SEND_OTP, {
                phone_number: phoneNumber,
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || "Failed to send OTP");
        }
    },

    verifyOtp: async (phoneNumber: string, otp: string): Promise<AuthResponse> => {
        try {
            const response = await axiosInstance.post(AUTH_URLS.VERIFY_OTP, {
                phone_number: phoneNumber,
                otp,
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.error || "Invalid OTP");
        }
    },
};
