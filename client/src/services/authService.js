import api from "./api";

export const forgotPassword = async (email) => {
    const response = await api.post("/auth/forgot-password", {
        email,
    });

    return response.data;
};

export const verifyOtp = async (email, otp) => {
    const response = await api.post("/auth/verify-otp", {
        email,
        otp,
    });

    return response.data;
};

export const resetPassword = async (email, password) => {
    const response = await api.post("/auth/reset-password", {
        email,
        password,
    });

    return response.data;
};