import api from "../config/axios";

export const reviewCode = async (code, language) => {
    const response = await api.post("/review", {
        code,
        language,
    });

    return response.data;
};