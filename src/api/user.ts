import axios from "axios";

const API_BASE_URL =  import.meta.env.VITE_BACKEND_URL;

// Get user account details
export const getAccount = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/user/protected-route`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Edit user account details
export const editAccount = async (userId: number, userData: object) => {
  const response = await axios.put(`${API_BASE_URL}/user/edit/${userId}`, userData);
  return response.data;
};

// Get all friends
export const getAllFriends = async (userId: number) => {
    const response = await axios.get(`${API_BASE_URL}/user/all-friends/${userId}`);
    return response.data;
  };

// Get users who are not friends yet
// ใน api/user.ts
export const getNotFriends = async (userId: number) => {
    const url = `${API_BASE_URL}/user/not-friend-yet/${userId}`; // เพิ่ม userId ใน URL
    console.log('Request URL:', url); // เพิ่ม console.log เพื่อตรวจสอบ URL
    const response = await axios.get(url); // ไม่ต้องใช้ params เพราะใส่ใน URL ไปแล้ว
    return response.data;
};


// Add a friend
export const addFriend = async (userId: number, friendId: number) => {
  const response = await axios.post(`${API_BASE_URL}/user/addfriend`, {
    userId,
    friendId,
  });
  return response.data;
};
