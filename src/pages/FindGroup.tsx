import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import Navigation from '@/components/Nav';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';

interface Group {
    id: number;
    name: string;
}

export default function FindGroup() {
    const [searchQuery, setSearchQuery] = useState(""); // State สำหรับเก็บคำค้นหา
    const [suggestedGroups, setSuggestedGroups] = useState<Group[]>([]); // State สำหรับกลุ่มแนะนำ
    const [recentGroups, setRecentGroups] = useState<Group[]>([]); // State สำหรับเก็บกลุ่มที่ดูล่าสุด
    const userId = 1; // หรือเปลี่ยนเป็น userId ที่คุณต้องการ

    useEffect(() => {
        fetchSuggestedGroups(); // เรียก fetchSuggestedGroups เมื่อ component โหลดครั้งแรก
        loadRecentGroups(); // โหลด recent groups จาก localStorage เมื่อ component โหลด
    }, []);

    const fetchSuggestedGroups = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/group/find/${userId}`, {
                params: { q: searchQuery } // ส่ง searchQuery เป็น params เพื่อใช้ค้นหา
            });
            setSuggestedGroups(response.data); // อัพเดต state ของ suggestedGroups
        } catch (error) {
            console.error("Error fetching suggested groups:", error);
        }
    };

    const loadRecentGroups = () => {
        const savedGroups = localStorage.getItem('recentGroups');
        if (savedGroups) {
            setRecentGroups(JSON.parse(savedGroups));
        }
    };

    const addToRecentGroups = (group: Group) => {
        const updatedRecentGroups = [group, ...recentGroups.filter(g => g.id !== group.id)].slice(0, 5); // เก็บแค่ 5 กลุ่มล่าสุด
        setRecentGroups(updatedRecentGroups);
        localStorage.setItem('recentGroups', JSON.stringify(updatedRecentGroups));
    };

    const handleGroupClick = (group: Group) => {
        addToRecentGroups(group);
        // ที่นี่คุณสามารถใส่โค้ดการ navigate ไปที่หน้ารายละเอียดของกลุ่มถ้าต้องการ
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        fetchSuggestedGroups(); // อัพเดต suggestedGroups ตามคำค้นหาใหม่
    };

    return (
        <div className="min-h-screen bg-gray-50 overflow-hidden">
            <Navigation />

            {/* Main Content */}
            <div className="max-w-6xl mx-auto p-6">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Sidebar */}
                    <div className="w-80 border-r pt-4 pr-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-indigo-700 text-lg">Find Group</h2>
                            <Link to="/create-group">
                                <Button className="ml-2 text-xs p-0 w-6 h-6 rounded-full flex items-center justify-center">
                                    +
                                </Button>
                            </Link>
                        </div>

                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Search"
                                className="pl-10 border-gray-300 focus:border-black-500 focus:ring-black-500 transition duration-150 ease-in-out"
                                onChange={handleSearchChange} // เรียกใช้ handleSearchChange เมื่อ input เปลี่ยน
                            />
                        </div>

                        <div>
                            <h3 className="text-sm text-gray-600 mb-2">Recent Groups</h3>
                            <div className="space-y-2">
                                {recentGroups.length === 0 ? (
                                    <span>No recent groups viewed.</span>
                                ) : (
                                    recentGroups.map((group) => (
                                        <div key={group.id} onClick={() => handleGroupClick(group)} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer transition duration-150">
                                            <Avatar className="w-8 h-8">
                                                <img src="https://github.com/shadcn.png" alt={group.name} />
                                            </Avatar>
                                            <span className="text-sm font-medium text-gray-800">{group.name}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Group Suggestions Grid */}
                    <div className="flex-1">
                        <h2 className="font-semibold text-indigo-700 mb-4">Group Suggestions</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {suggestedGroups.length === 0 ? (
                                <span>No suggested groups found.</span>
                            ) : (
                                suggestedGroups.map((group) => (
                                    <div key={group.id} className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center" onClick={() => handleGroupClick(group)}>
                                        <Avatar className="w-20 h-20 mb-3">
                                            <img src="https://github.com/shadcn.png" alt={group.name} />
                                        </Avatar>
                                        <h3 className="font-medium mb-2">{group.name}</h3>
                                        <Button variant="outline" className="w-full">
                                            Join Group
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
