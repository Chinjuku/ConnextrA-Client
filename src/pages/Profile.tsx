import { useContext, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, MapPin, Camera, Edit2 } from "lucide-react";
import Navigation from '@/components/Nav';
import { UserContext } from "@/context/UserContext"; // Import UserContext

const Profile = () => {
    const { userData, isLoading, setUserData } = useContext(UserContext); // Get user data and loading state from context
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        province: "", 
        country: "", 
        dob: "",
        about: ""
    });

    const capitalize = (str: string | null) => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };


    useEffect(() => {
        if (userData) {
            setFormData({
                firstName: capitalize(userData.given_name) || "-",
                lastName: capitalize(userData.family_name) || "-",
                email: userData.email || "email@example.com",
                phone: userData.phone || "0",
                province: userData.province || "-", // Changed to province
                country: userData.country || "-", // New field
                dob: userData.date_of_birth || "-", // New field
                about: userData.about || "Passionate web developer with 5 years of experience in creating user-friendly applications."
            });
        }
    }, [userData]);

    const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const toggleEditMode = () => {
        setIsEditing((prev) => !prev);
    };

    const handleSaveChanges = async () => {
        try {
            const apiUrl = '/api/updateUser'; // Adjust this to your actual endpoint
            const updatedUserData = {
                ...userData,
                given_name: formData.firstName,
                family_name: formData.lastName, // Save last name
                email: formData.email,
                phone: formData.phone,
                province: formData.province, // Save province
                country: formData.country, // Save country
                dob: formData.dob, // Save DOB
                about: formData.about,
            };

            const response = await fetch(apiUrl, {
                method: 'PUT', // or 'POST' depending on your API design
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUserData),
            });

            if (!response.ok) {
                throw new Error('Failed to update user data');
            }

            const data = await response.json();
            setUserData(data); // Update context with new user data
            toggleEditMode(); // Exit editing mode
        } catch (error) {
            console.error("Error updating user data:", error);
            // Handle error (e.g., show a notification to the user)
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen text-gray-500">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />
            <div className="max-w-4xl mx-auto space-y-6 p-6">
                {/* Profile Header */}
                <Card className="shadow-lg rounded-lg overflow-hidden">
                    <CardContent className="pt-8 pb-6 px-6 bg-white rounded-t-lg">
                        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                            <div className="relative">
                                <Avatar className="w-32 h-32 border-4 border-white shadow-lg rounded-full">
                                    <AvatarImage src={userData?.image_url || "https://github.com/shadcn.png"} alt="Profile Picture" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="absolute bottom-0 right-0 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-transform transform hover:scale-105"
                                >
                                    <Camera className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-3xl font-semibold mb-2 text-gray-700">{`${formData.firstName} ${formData.lastName}`}</h2>
                                <p className="text-gray-500 mb-4">Web Developer</p>
                                <Button 
                                    variant="outline" 
                                    className="gap-2 text-gray-600 border-gray-300 hover:bg-gray-100"
                                    onClick={toggleEditMode}
                                >
                                    <Edit2 className="h-4 w-4" />
                                    {isEditing ? "Cancel" : "Edit Profile"}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Personal Information Section */}
                <Card className="shadow-lg rounded-lg overflow-hidden">
                    <CardHeader className="text-black py-4 px-6">
                        <CardTitle className="text-lg font-semibold">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 p-6 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[{ label: "First Name", icon: <User />, name: "firstName", value: formData.firstName },
                              { label: "Last Name", icon: <User />, name: "lastName", value: formData.lastName }, // Last Name field
                              { label: "Email", icon: <Mail />, name: "email", value: formData.email },
                              { label: "Phone", icon: <Phone />, name: "phone", value: formData.phone },
                              { label: "Province", icon: <MapPin />, name: "province", value: formData.province }, // Changed to province
                              { label: "Country", icon: <MapPin />, name: "country", value: formData.country }, // Country field
                              { label: "Date of Birth", icon: <MapPin />, name: "dob", value: formData.dob }] // DOB field
                            .map(({ label, icon, name, value }) => (
                                <div key={name} className="space-y-2">
                                    <Label className="flex items-center gap-2 text-gray-600">
                                        {icon}
                                        {label}
                                    </Label>
                                    <Input
                                        name={name}
                                        value={value}
                                        readOnly={!isEditing}
                                        onChange={handleInputChange}
                                        className={`rounded-md ${isEditing ? 'bg-gray-50 border-gray-300' : 'bg-gray-100 text-gray-600'} focus:outline-none`}
                                    />
                                </div>
                            ))}

                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <Label className="text-gray-600">About Me</Label>
                            <Input
                                name="about"
                                value={formData.about}
                                readOnly={!isEditing}
                                onChange={handleInputChange}
                                className={`h-24 rounded-md ${isEditing ? 'bg-gray-50 border-gray-300' : 'bg-gray-100 text-gray-600'} focus:outline-none`}
                            />
                        </div>

                        {isEditing && (
                            <div className="flex justify-end gap-4 mt-4">
                                <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-100" onClick={toggleEditMode}>Cancel</Button>
                                <Button className="bg-blue-500 text-white hover:bg-blue-600 transition-colors" onClick={handleSaveChanges}>Save Changes</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
