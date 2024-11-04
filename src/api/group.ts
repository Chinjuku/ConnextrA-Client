import axios from "axios";

const API_BASE_URL =  import.meta.env.VITE_BACKEND_URL;

export const getMember = async (id: number) => {
    const response = await axios.get(`${API_BASE_URL}/group/member/${id}`);
    return response.data;
}