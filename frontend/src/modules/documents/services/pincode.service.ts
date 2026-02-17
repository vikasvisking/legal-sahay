import axios from "axios";
import { EXTERNAL_URLS } from "../constants/urls";
import type { PincodeResponse } from "../types/document.types";

export const PincodeService = {
    getData: async (pincode: string): Promise<PincodeResponse> => {
        try {
            const response = await axios.get(`${EXTERNAL_URLS.PINCODE}/${pincode}`);
            // The API returns an array with one object usually
            if (Array.isArray(response.data) && response.data.length > 0) {
                return response.data[0];
            }
            throw new Error("Invalid response format");
        } catch (error: any) {
            throw new Error("Failed to fetch pincode data");
        }
    }
};
