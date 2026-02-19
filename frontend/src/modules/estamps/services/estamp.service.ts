import { axiosInstance } from "@/lib/axios";

export interface State {
    id: number;
    name: string;
    code?: string;
}

export interface Article {
    id: number;
    title: string;
    description?: string;
    is_all_states: boolean;
}

export const EStampService = {
    getStates: async (): Promise<State[]> => {
        try {
            const response = await axiosInstance.get('/api/masters/states/');
            return response.data;
        } catch (error) {
            console.error("Failed to fetch states", error);
            return [];
        }
    },

    getArticles: async (stateId?: string): Promise<Article[]> => {
        try {
            const params = stateId ? { state_id: stateId } : {};
            const response = await axiosInstance.get('/api/masters/articles/', { params });
            return response.data;
        } catch (error) {
            console.error("Failed to fetch articles", error);
            return [];
        }
    }
};
