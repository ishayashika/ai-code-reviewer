import api from "./api";

export const reviewCode = async (code, language) => {
    const response = await api.post("/review", {
        code,
        language,
    });

    return response.data;
};