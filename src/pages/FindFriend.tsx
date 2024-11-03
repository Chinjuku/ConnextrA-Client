import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // นำเข้า useParams
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import Navigation from '@/components/Nav';
import { User } from "@/types/user.types"; // สมมติว่ามีการสร้าง type User
import { getNotFriends, addFriend } from "@/api/user"; // นำเข้า getNotFriends และ addFriend API

export default function FindFriend() {
  const { userId } = useParams(); // รับ userId จาก URL
  const [notFriends, setNotFriends] = useState<User[]>([]); // สร้าง state เพื่อเก็บข้อมูลผู้ใช้ที่ไม่เป็นเพื่อน
  const [loading, setLoading] = useState(true); // สถานะการโหลด

  useEffect(() => {
    const fetchNotFriends = async () => {
      setLoading(true); // ตั้งค่าให้กำลังโหลด
      try {
        const users = await getNotFriends(Number(userId)); // ดึงข้อมูลผู้ใช้ที่ไม่เป็นเพื่อน
        setNotFriends(users); // อัปเดต state ด้วยข้อมูลที่ดึงมา
      } catch (error) {
        console.error("Error fetching not friends:", error);
      } finally {
        setLoading(false); // เปลี่ยนสถานะโหลดเมื่อเสร็จสิ้น
      }
    };

    fetchNotFriends();
  }, [userId]);

  // ฟังก์ชันสำหรับเพิ่มเพื่อน
  const handleAddFriend = async (friendId: number) => {
    try {
      const response = await addFriend(Number(userId), friendId); // ส่ง userId และ friendId
      console.log(response.message); // แสดงข้อความที่ได้จากเซิร์ฟเวอร์
      // หากต้องการ อัปเดต UI เช่น ลบเพื่อนออกจากรายการ notFriends
      setNotFriends((prevNotFriends) => prevNotFriends.filter(user => user.id !== friendId));
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      <Navigation />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="w-80 border-r pt-4 pr-4">
            <h2 className="font-semibold mb-4 text-indigo-700 text-lg">Find Friend</h2>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search"
                className="pl-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition duration-150 ease-in-out"
              />
            </div>
            <div>
              <h3 className="text-sm text-gray-600 mb-2">Recent</h3>
              <div className="space-y-2">
                {["Pisol Uttapatanina", "Puttaraporn Jitpranee"].map((name, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer transition duration-150">
                    <Avatar className="w-8 h-8">
                      <img src="https://github.com/shadcn.png" alt={name} />
                    </Avatar>
                    <span className="text-sm font-medium text-gray-800">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Friend Suggestions Grid */}
          <div className="flex-1">
            <h2 className="font-semibold text-indigo-700 mb-4">Friend Suggestions</h2>
            {loading ? (
              <div className="flex items-center justify-center min-h-[200px]">
                <span className="text-lg text-indigo-950">Loading friends...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {notFriends.map((user) => (
                  <div key={user.id} className="bg-white p-4 rounded-lg shadow-lg transition transform hover:shadow-xl flex flex-col items-center justify-center">
                    <Avatar className="w-20 h-20 mb-3 flex justify-center items-center">
                      <img src={user.image_url} alt={`${user.given_name} ${user.family_name}`} loading="lazy" />
                    </Avatar>
                    <h3 className="font-medium mb-2 text-center">{user.given_name} {user.family_name}</h3>
                    <Button
                      variant="outline"
                      className="w-full hover:bg-indigo-700 hover:text-white transition duration-150"
                      onClick={() => handleAddFriend(user.id)} // เรียกใช้ฟังก์ชันเมื่อคลิกปุ่ม
                    >
                      Add friend
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
