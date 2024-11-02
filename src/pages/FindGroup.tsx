import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import Navigation from '@/components/Nav';
import { Link } from "react-router-dom";

export default function FindGroup() {
    return (
        <div className="min-h-screen bg-gray-50 overflow-hidden">
            <Navigation />

            {/* Main Content */}
            <div className="max-w-6xl mx-auto p-6">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Sidebar */}
                    <div className="w-80 border-r pt-4 pr-4">
                        <div className="flex items-center justify-between mb-4"> {/* ใช้ flex เพื่อจัดเรียงแนวนอน */}
                            <h2 className="font-semibold text-indigo-700 text-lg">Find Group</h2>
                            <Link to="/create-group"> {/* เปลี่ยนเส้นทางที่คุณต้องการไป */}
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
                            />
                        </div>
                        <div>
                            <h3 className="text-sm text-gray-600 mb-2">Recent Groups</h3>
                            <div className="space-y-2">
                                {["Group 1", "Group 2", "Group 3"].map((group, index) => (
                                    <div key={index} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer transition duration-150">
                                        <Avatar className="w-8 h-8">
                                            <img src="https://github.com/shadcn.png" alt={group} />
                                        </Avatar>
                                        <span className="text-sm font-medium text-gray-800">{group}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Group Suggestions Grid */}
                    <div className="flex-1">
                        <h2 className="font-semibold text-indigo-700 mb-4">Group Suggestions</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <div key={i} className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
                                    <Avatar className="w-20 h-20 mb-3">
                                        <img src="https://github.com/shadcn.png" alt={`Group ${i + 1}`} />
                                    </Avatar>
                                    <h3 className="font-medium mb-2">Group {i + 1}</h3>
                                    <Button variant="outline" className="w-full">
                                        Join Group
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
