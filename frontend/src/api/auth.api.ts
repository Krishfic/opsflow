import api from "./axios";

export interface LoginData {
    email: string;
    password: string;
}

export const loginUser = async (
    data: LoginData
) => {
    const response = await api.post(
        "/auth/login",
        data
    );

    return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get("/auth/me");

    return response.data;
};

export const logoutUser = async () => {
    const response = await api.post("/auth/logout");

    return response.data;
};