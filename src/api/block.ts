import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

// Block a friend
export const blockFriend = async (userId: number, friendId: number) => {
  const response = await axios.post(`${API_BASE_URL}/user/block-friend`, {
    userId,
    friendId,
  });
  return response.data;
};

// Unblock a friend
export const unblockFriend = async (userId: number, friendId: number) => {
  const response = await axios.delete(`${API_BASE_URL}/user/block-friend`, {
    data: { userId, friendId },
  });
  return response.data;
};
