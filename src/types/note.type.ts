// src/types/note.ts

export interface Note {
    title: string;           // ชื่อโน้ต
    content: string;         // เนื้อหาของโน้ต
    image?: string;          // รูปภาพ (อาจไม่มี)
    timestamp: string;       // เวลาที่โน้ตถูกสร้าง
    friendId: string | null; // ID ของเพื่อนที่โน้ตเกี่ยวข้อง
    userId: string | null;   // ID ของผู้สร้างโน้ต
    userName: string;
}
