import api from "./api";

export const saveHistory = async (historyData) => {
    const response = await api.post("/history", historyData);

    return response.data;
};

export const getHistory = async () => {
    const response = await api.get("/history");

    return response.data;
};

export const deleteHistory = async (id) => {
    const response = await api.delete(`/history/${id}`);
    return response.data;
};