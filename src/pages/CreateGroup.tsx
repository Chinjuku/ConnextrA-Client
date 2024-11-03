import { useEffect, useState, useContext } from "react";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import Nav from "@/components/Nav";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserContext } from "@/context/UserContext"; // นำเข้า UserContext
import { useNavigate } from "react-router-dom"; // ใช้ useNavigate แทน useRouter

interface Friend {
  id: string;
  given_name: string;
  family_name: string;
  image_url: string;
}

const CreateGroup = () => {
  const { userData } = useContext(UserContext); // ดึงข้อมูลผู้ใช้
  const [groupName, setGroupName] = useState("");
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertGroupName, setAlertGroupName] = useState("");
  const [alertSelectedFriends, setAlertSelectedFriends] = useState<string[]>(
    []
  );
  const [friends, setFriends] = useState<Friend[]>([]); // สถานะสำหรับเพื่อนทั้งหมด
  const [searchQuery, setSearchQuery] = useState(""); // สถานะสำหรับการค้นหา
  const [alertMessage, setAlertMessage] = useState(""); // สถานะสำหรับข้อความเตือน
  const navigate = useNavigate(); // สร้าง instance ของ useNavigate

  const userId = userData?.id;

  useEffect(() => {
    const fetchAllFriends = async () => {
      if (userId) {
        const response = await fetch(
          `http://localhost:3000/user/all-friends/${userId}`
        );
        if (response.ok) {
          const data: Friend[] = await response.json();
          setFriends(data); // ตั้งค่าเพื่อนทั้งหมด
        } else {
          console.error("Error fetching friends:", response.statusText);
        }
      }
    };

    fetchAllFriends();
  }, [userId]); // ทำงานใหม่เมื่อ userId เปลี่ยนแปลง

  const handleCancel = () => {
    navigate("/find-group"); // นำทางไปยังหน้าที่ต้องการเมื่อกด Cancel
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedFriends((prev) => {
      if (prev.includes(id)) {
        return prev.filter((friendId) => friendId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ตรวจสอบว่ามีการป้อนชื่อกลุ่มหรือไม่
    if (!groupName.trim()) {
      setAlertMessage("Please enter a group name."); // ตั้งค่าข้อความเตือน
      setAlertVisible(true); // แสดง alert
      return; // ออกจากฟังก์ชัน
    }

    const response = await fetch("http://localhost:3000/group/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        friendIds: selectedFriends,
        group_name: groupName,
      }),
    });

    if (response.ok) {
      setAlertGroupName(groupName);
      setAlertSelectedFriends(selectedFriends);
      setAlertVisible(true);
      setGroupName(""); // รีเซ็ตชื่อกลุ่ม
      setSelectedFriends([]); // รีเซ็ตเพื่อนที่เลือก
      setAlertMessage("Group created successfully!"); // ตั้งค่าข้อความแจ้งเตือนการสร้างกลุ่มสำเร็จ
      navigate("/chat"); // เปลี่ยนเส้นทางไปที่หน้า /chat
    } else {
      // Handle error
      console.error("Error creating group");
    }
  };

  // ฟังก์ชันสำหรับกรองเพื่อนตามค่าที่ค้นหา
  const filteredFriends = friends.filter((friend) => {
    const fullName = `${friend.given_name} ${friend.family_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6 mt-6">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-semibold">Create new group</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-4 mb-8">
            <Avatar className="w-16 h-16">
              <div className="w-16 h-16 rounded-full bg-blue-100" />
            </Avatar>
            <Input
              type="text"
              placeholder="Group name.."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">Members:</span>
                <span className="text-sm font-medium">
                  {selectedFriends.length}
                </span>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search"
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} // ปรับปรุงค่า searchQuery
                />
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-gray-500">Friends</p>
              {filteredFriends.map((friend) => (
                <div key={friend.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`friend-${friend.id}`}
                    checked={selectedFriends.includes(friend.id)}
                    onChange={() => handleCheckboxChange(friend.id)}
                    className="cursor-pointer h-4 w-4 text-blue-600 border-2 border-gray-300 rounded-full appearance-none checked:bg-blue-600 checked:border-transparent focus:ring-0"
                  />
                  <Avatar className="w-8 h-8">
                    <img src={friend.image_url} alt={friend.given_name} />
                  </Avatar>
                  <label
                    htmlFor={`friend-${friend.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {friend.given_name} {friend.family_name}{" "}
                    {/* รวมชื่อและนามสกุล */}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>{" "}
            {/* ปรับปรุงปุ่ม Cancel */}
            <Button type="submit">Create</Button>
          </div>
        </form>

        {alertVisible && (
          <Alert className="mt-4">
            <AlertTitle>{alertMessage || "Group Created!"}</AlertTitle>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default CreateGroup;
