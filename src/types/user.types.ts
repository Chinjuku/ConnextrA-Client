export type User = {
    id: number;
    email: string;
    family_name: string | null;
    given_name: string | null;
    google_id: string;
    date_of_birth: string | null; // Can also be Date depending on your format
    country: string | null;
    province: string | null; // New field for province
    phone: string | null; // Ensure phone field is included
    image_url: string;
    about: string | null; // New field for about
    created_at: string; // Can also be Date if you want to handle timestamps
}
