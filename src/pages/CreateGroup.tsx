import { useState } from "react";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import Nav from "@/components/Nav";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // นำเข้า Alert จาก ShadCN UI

interface Friend {
    id: string;
    name: string;
    avatar: string;
}

const CreateGroup = () => {
    const [groupName, setGroupName] = useState("");
    const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertGroupName, setAlertGroupName] = useState("");
    const [alertSelectedFriends, setAlertSelectedFriends] = useState<string[]>([]);

    const friends: Friend[] = [
        { id: "1", name: "Pisol Uttaganjana", avatar: "https://github.com/shadcn.png" },
        { id: "2", name: "Puttaraporn Jitpranee", avatar: "https://github.com/shadcn.png" },
        { id: "3", name: "Hello Kitty", avatar: "https://github.com/shadcn.png" },
        { id: "4", name: "Sherlock Holmes", avatar: "https://github.com/shadcn.png" },
    ];

    const handleCheckboxChange = (id: string) => {
        setSelectedFriends((prev) => {
            if (prev.includes(id)) {
                return prev.filter((friendId) => friendId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log("Group Name:", groupName);
        console.log("Selected Friends:", selectedFriends);
        // เก็บข้อมูลก่อนรีเซ็ตค่า
        setAlertGroupName(groupName);
        setAlertSelectedFriends(selectedFriends);
        setAlertVisible(true); // แสดง Alert
        setGroupName(""); // รีเซ็ตชื่อกลุ่ม
        setSelectedFriends([]); // รีเซ็ตเพื่อนที่เลือก
    };

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
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm">Members:</span>
                                <span className="text-sm font-medium">{selectedFriends.length}</span>
                            </div>
                            <div className="relative w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                <Input type="search" placeholder="Search" className="pl-8" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <p className="text-sm text-gray-500">Friends</p>
                            {friends.map((friend) => (
                                <div key={friend.id} className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id={`friend-${friend.id}`}
                                        checked={selectedFriends.includes(friend.id)}
                                        onChange={() => handleCheckboxChange(friend.id)}
                                        className="cursor-pointer h-4 w-4 text-blue-600 border-2 border-gray-300 rounded-full appearance-none checked:bg-blue-600 checked:border-transparent focus:ring-0"

                                    />
                                    <Avatar className="w-8 h-8">
                                        <img src={friend.avatar} alt={friend.name} />
                                    </Avatar>
                                    <label
                                        htmlFor={`friend-${friend.id}`}
                                        className="text-sm cursor-pointer"
                                    >
                                        {friend.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline">Cancel</Button>
                        <Button type="submit">Create</Button>
                    </div>
                </form>

                {alertVisible && (
                    <Alert className="mt-4">
                        <AlertTitle>Group Created!</AlertTitle>
                        <AlertDescription>
                            Group Name: {alertGroupName || "N/A"}<br />
                            Selected Friends: {alertSelectedFriends.length > 0 ? alertSelectedFriends.join(", ") : "None"}
                        </AlertDescription>
                    </Alert>
                )}

            </div>
        </div>
    );
};

export default CreateGroup;
