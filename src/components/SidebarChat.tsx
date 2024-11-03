import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Search, Users, UserPlus } from "lucide-react";

interface SidebarProps {
    onFriendSelect: (friendName: string) => void; // Callback to notify friend selection
}

const Sidebar: React.FC<SidebarProps> = ({ onFriendSelect }) => {
    const friends = [{ id: 1, name: "Pisol Uattankanjana" }, { id: 2, name: "John Doe" }, { id: 3, name: "Jane Smith" }]; // Sample friend list
    const [searchTerm, setSearchTerm] = useState(""); // State to track search input

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value); // Update the search term state
    };

    const filteredFriends = friends.filter(friend => 
        friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    ); // Filter friends based on search term

    const renderFriendList = () => {
        return filteredFriends.length > 0 ? (
            <ul className="flex flex-col gap-3">
                {filteredFriends.map(friend => (
                    <li
                        key={friend.id}
                        className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-200"
                        onClick={() => onFriendSelect(friend.name)} // Notify selection
                    >
                        <Users className="w-6 h-6 text-gray-600" />
                        <p className="text-sm font-medium">{friend.name}</p>
                    </li>
                ))
                }
            </ul>
        ) : (
            <EmptyState />
        );
    };

    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center flex-grow text-center h-[500px]">
            <div className="w-32 h-32 border-2 border-dashed rounded-full flex items-center justify-center mb-4">
                <Users className="w-12 h-12 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">No friends found.</p>
            <Link to="/find-friend" className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1">
                <UserPlus className="w-4 h-4" />
                Let's find friends
            </Link>
        </div>
    );

    return (
        <aside className="w-80 border-r pt-4 pr-4 flex-shrink-0">
            <div className="space-y-4">
                <header className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Chats</h2>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                        </span>
                    </Button>
                </header>

                <Tabs defaultValue="direct" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="direct">Direct</TabsTrigger>
                        <TabsTrigger value="groups">Groups</TabsTrigger>
                        <TabsTrigger value="blocked">Blocked</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                        placeholder="Search" 
                        className="pl-10" 
                        value={searchTerm} // Controlled input
                        onChange={handleSearchChange} // Update state on input change
                    />
                </div>

                {/* Chat List or Empty State */}
                {renderFriendList()}
            </div>
        </aside>
    );
};

export default Sidebar;
