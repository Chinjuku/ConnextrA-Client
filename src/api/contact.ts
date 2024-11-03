import axios from "axios";

export const getAllFriends = async (userId: number) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/all-friends/${userId}`);
        return response.data;
    } catch (err) {
        console.error("Error fetching friends:", err);
        throw err;
    }
}

export const getAllGroups = async (userId: number) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/group/${userId}`);
        return response.data;
    } catch (err) {
        console.error("Error fetching friends:", err);
        throw err;
    }
}

export const getAllBlocks = async (userId: number) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/blocked/${userId}`);
        return response.data;
    } catch (err) {
        console.error("Error fetching friends:", err);
        throw err;
    }
}

export const unBlocked = async (userId: number, friendId: number) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/user/unblock/${userId}/${friendId}`);
        console.log(response.data)
        return response.data;
    } catch (err) {
        console.error("Error fetching friends:", err);
        throw err;
    }
}

export const getFriend = async (friendId: number) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/friend-account/${friendId}`);
        console.log(response.data)
        return response.data;
    } catch (err) {
        console.error("Error fetching friends:", err);
        throw err;
    }
}

export const getGroup = async (groupId: number) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/group/${groupId}`);
        console.log(response.data)
        return response.data;
    } catch (err) {
        console.error("Error fetching friends:", err);
        throw err;
    }
}

