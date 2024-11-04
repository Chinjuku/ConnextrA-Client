import axios from "axios";

const API_BASE_URL =  import.meta.env.VITE_BACKEND_URL;

export const getMessages = async (
    userId: number,
    friendId: number
) => {
    const response = await axios.get(`${API_BASE_URL}/message/loadMessages?userId=${userId}&friendId=${friendId}`);
    return response.data;
}

export const getGroupMessages = async (
    userId: number,
    groupId: number
) => {
    const response = await axios.get(`${API_BASE_URL}/message/loadGroupMessages?userId=${userId}&groupId=${groupId}`);
    console.log(response.data);
    return response.data;
}