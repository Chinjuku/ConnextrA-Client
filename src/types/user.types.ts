export type User =  {
    id: number;
    email: string;
    family_name: string | null;
    given_name: string | null;
    google_id: string;
    date_of_birth: string | null; // หรือ Date ขึ้นอยู่กับรูปแบบที่คุณต้องการ
    country: string | null;
    image_url: string;
    created_at: string; // หรือ Date ถ้าคุณต้องการจัดการกับวันเวลา
}