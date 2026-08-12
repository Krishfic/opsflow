import api from "./axios";

export interface DashboardResponse {
    success: boolean;
    dashboard: any;
}

export const getDashboard =
    async (): Promise<DashboardResponse> => {
        const response =
            await api.get("/dashboard");

        return response.data;
    };