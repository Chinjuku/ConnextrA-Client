// api/note.ts
import axios from "axios";
import { Note } from "@/types/note.type"; // สมมุติว่าใช้ type สำหรับ Note

// ฟังก์ชันสำหรับเพิ่มโน้ตใหม่
export const addNote = async (note: Note) => {
    try {
        const response = await axios.post('http://localhost:3000/note/create', note); // เปลี่ยน URL ตามที่คุณใช้งาน
        return response.data; // ส่งกลับโน้ตที่สร้างใหม่
    } catch (error) {
        console.error("Error adding note:", error);
        throw new Error("Failed to add note.");
    }
};

// ฟังก์ชันสำหรับดึงโน้ตสำหรับผู้ใช้และเพื่อน
export const getNotesByUserAndFriend = async (userId: string) => {
    try {
        const response = await axios.get(`http://localhost:3000/note/user/${userId}`);
        return response.data; // ส่งกลับโน้ตสำหรับผู้ใช้
    } catch (error) {
        console.error("Error retrieving notes:", error);
        throw new Error("Failed to retrieve notes.");
    }
};


export const deleteNote = async (noteId: number) => {
    try {
        await axios.delete(`http://localhost:3000/note/delete/${noteId}`); // URL สำหรับลบโน้ต
    } catch (error) {
        console.error("Error deleting note:", error);
        throw new Error("Failed to delete note.");
    }
};