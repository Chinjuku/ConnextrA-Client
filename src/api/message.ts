import axios from "axios";

const API_BASE_URL =  import.meta.env.VITE_BACKEND_URL;

export const getMessages = async (
    userId: number,
    friendId: number | null = null,
    groupId: number | null = null
) => {
    console.log(`${API_BASE_URL}/message/loadMessages?userId=${userId}&friendId=${friendId}&groupId=${groupId}`)
    const response = await axios.get(`${API_BASE_URL}/message/loadMessages?userId=${userId}&friendId=${friendId}&groupId=${groupId}`);
    return response.data;
}