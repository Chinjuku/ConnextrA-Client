import { useContext, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, MapPin, Camera, Edit2 } from "lucide-react";
import Navigation from "@/components/Nav";
import { UserContext } from "@/context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "@/components/Loading";

export default function Profile(){
  const { userData, isLoading, setUserData } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    province: "",
    country: "",
    dob: "",
    about_me: "", // ใช้ชื่อฟิลด์ที่ถูกต้อง
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
        province: userData.province || "-",
        country: userData.country || "-",
        dob: userData.date_of_birth || "-",
        about_me: userData.about || "-", // ใช้ชื่อฟิลด์ที่ถูกต้อง
      });
    }
  }, [userData]);

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSaveChanges = async () => {
    try {
      if (!userData) {
        console.error("User data is not available");
        return;
      }

      const apiUrl = `http://localhost:3000/user/edit/${userData.id}`;
      const updatedUserData = {
        given_name: formData.firstName,
        family_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        province: formData.province,
        country: formData.country,
        date_of_birth: formData.dob,
        about_me: formData.about_me, // ใช้ชื่อฟิลด์ที่ถูกต้อง
      };

      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUserData),
      });

      const text = await response.text();

      console.log("Response from server:", text);

      if (!response.ok) {
        console.error("Error response:", text);
        throw new Error("Failed to update user data");
      }

      toast.success(text);

      setUserData({
        ...userData,
        given_name: formData.firstName,
        family_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        province: formData.province,
        country: formData.country,
        date_of_birth: formData.dob,
        about: formData.about_me, // ใช้ชื่อฟิลด์ที่ถูกต้อง
      });

      toggleEditMode();
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Failed to update profile.");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto space-y-6 p-6">
        {/* Profile Header */}
        <Card className="shadow-lg rounded-lg overflow-hidden">
          <CardContent className="space-y-6 p-6 bg-white">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg rounded-full">
                  <AvatarImage
                    src={userData?.image_url || "https://github.com/shadcn.png"}
                    alt="Profile Picture"
                  />
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
            <CardTitle className="text-lg font-semibold">
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                // รายการข้อมูลที่แสดงในโปรไฟล์
                {
                  label: "First Name",
                  icon: <User />,
                  name: "firstName",
                  value: formData.firstName,
                },
                {
                  label: "Last Name",
                  icon: <User />,
                  name: "lastName",
                  value: formData.lastName,
                },
                {
                  label: "Email",
                  icon: <Mail />,
                  name: "email",
                  value: formData.email,
                },
                {
                  label: "Phone",
                  icon: <Phone />,
                  name: "phone",
                  value: formData.phone,
                },
                {
                  label: "Province",
                  icon: <MapPin />,
                  name: "province",
                  value: formData.province,
                },
                {
                  label: "Country",
                  icon: <MapPin />,
                  name: "country",
                  value: formData.country,
                },
                {
                  label: "Date of Birth",
                  icon: <MapPin />,
                  name: "dob",
                  value: formData.dob,
                  isDateInput: true,
                },
              ].map(({ label, icon, name, value, isDateInput }) => (
                <div key={name} className="space-y-2">
                  <Label className="flex items-center gap-2 text-gray-600">
                    {icon}
                    {label}
                  </Label>
                  {isDateInput ? ( // ตรวจสอบว่าฟิลด์เป็นวันที่หรือไม่
                    <input
                      type="date"
                      name={name}
                      value={value}
                      readOnly={!isEditing}
                      onChange={handleInputChange}
                      className={`rounded-md ${
                        isEditing
                          ? "bg-gray-50 border-gray-300"
                          : "bg-gray-100 text-gray-600"
                      } focus:outline-none`}
                    />
                  ) : (
                    <Input
                      name={name}
                      value={value}
                      readOnly={!isEditing}
                      onChange={handleInputChange}
                      className={`rounded-md ${
                        isEditing
                          ? "bg-gray-50 border-gray-300"
                          : "bg-gray-100 text-gray-600"
                      } focus:outline-none`}
                    />
                  )}
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-gray-600">About Me</Label>
              <Input
                name="about_me" // เปลี่ยนชื่อฟิลด์ที่นี่
                value={formData.about_me} // ใช้ about_me
                readOnly={!isEditing}
                onChange={handleInputChange}
                className={`h-24 rounded-md ${
                  isEditing
                    ? "bg-gray-50 border-gray-300"
                    : "bg-gray-100 text-gray-600"
                } focus:outline-none`}
              />
            </div>

            {isEditing && (
              <div className="flex justify-end gap-4 mt-4">
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-600 hover:bg-gray-100"
                  onClick={toggleEditMode}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <ToastContainer /> {/* Include ToastContainer for notifications */}
    </div>
  );
};

