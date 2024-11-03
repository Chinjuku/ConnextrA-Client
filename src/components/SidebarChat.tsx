import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Search, Users, UserPlus } from "lucide-react";
import { getAllBlocks, getAllFriends, getAllGroups, unBlocked } from "@/api/contact";
import { User } from "@/types/user.types";
import { Group } from "@/types/group.type";

type SidebarProps = {
    friendId: string | null
    groupId: string | null
    blockId: string | null
    userId: number | undefined
}

const Sidebar: React.FC<SidebarProps> = ({
    friendId,
    groupId,
    blockId,
    userId
}) => {
    const [friends, setFriends] = useState<User[]>([])
    const [groups, setGroups] = useState<Group[]>([])
    const [blockedUsers, setBlocks] = useState<User[]>([])

    const [searchTerm, setSearchTerm] = useState(""); 
    const [activeTab, setActiveTab] = useState("direct");
    // console.log(userId)
    useEffect(() => {
        const fetchAllFriends = async () => {
            if (userId){
                const res_friends = await getAllFriends(userId)
                const res_groups = await getAllGroups(userId)
                const res_blocks = await getAllBlocks(userId)
                setFriends(res_friends)
                setGroups(res_groups)
                setBlocks(res_blocks)
            }
        }
        fetchAllFriends()
    }, [userId])

    useEffect(() => {
        if (friendId) {
            setActiveTab("direct");
        } else if (groupId) {
            setActiveTab("groups");
        } else if (blockId) {
            setActiveTab("blocked");
        }
    }, [friendId, groupId, blockId, userId]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };
    const filteredFriends = friends.filter(friend =>
        (friend.given_name && friend.given_name.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (friend.family_name && friend.family_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredBlocked = blockedUsers.filter(user =>
        (user.given_name && user.given_name.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (user.family_name && user.family_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleUnblocked = async (id : number) => {
        if (userId){
            await unBlocked(userId, id)
            setBlocks(prevBlocks => prevBlocks.filter(block => block.id !== id));
        }
    }

    const renderList = () => {
        if (activeTab === "direct") {
            return filteredFriends.length > 0 ? (
                <ul className="flex flex-col gap-3">
                    {filteredFriends.map(friend => (
                        <li key={friend.id}>
                            <form action="/chat" method="GET" className="w-full h-full flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-200">
                                <input type="hidden" name="friendId" value={friend.id} />
                                <button type="submit" className="w-full h-full flex items-center gap-3">
                                    <Users className="w-6 h-6 text-gray-600" />
                                    <p className="text-sm font-medium">{friend.given_name} {friend.family_name}</p>
                                </button>
                            </form>
                        </li>
                    ))}
                </ul>
            ) : (
                <EmptyState message="No friends found." />
            );
        } else if (activeTab === "groups") {
            return filteredGroups.length > 0 ? (
                <ul className="flex flex-col gap-3">
                    {filteredGroups.map(group => (
                        <li key={group.id}>
                            <form action="/chat" method="GET" className="w-full h-full flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-200">
                                <input type="hidden" name="groupId" value={group.id} />
                                <button type="submit" className="flex items-center gap-3 w-full h-full">
                                    <Users className="w-6 h-6 text-gray-600" />
                                    <p className="text-sm font-medium">{group.name}</p>
                                </button>
                            </form>
                        </li>
                    ))}
                </ul>
            ) : (
                <EmptyState message="No groups found." />
            );
        } else if (activeTab === "blocked") {
            return filteredBlocked.length > 0 ? (
                <ul className="flex flex-col gap-3">
                    {filteredBlocked.map(user => (
                        <li key={user.id}>
                            <div className="w-full h-full  p-2 rounded-lg flex justify-between">
                                <div className="flex items-center gap-3">
                                    <Users className="w-6 h-6 text-gray-600" />
                                    <p className="text-sm font-medium">{user.given_name} {user.family_name}</p>
                                </div>
                                <button onClick={() => handleUnblocked(user.id)} className="text-red-600">
                                    X
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <EmptyState message="No blocked users found." />
            );
        }
    };

    const EmptyState = ({ message }: { message: string }) => (
        <div className="flex flex-col items-center justify-center flex-grow text-center h-[500px]">
            <div className="w-32 h-32 border-2 border-dashed rounded-full flex items-center justify-center mb-4">
                <Users className="w-12 h-12 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">{message}</p>
            {message === "No friends found." && (
                <Link to="/find-friend" className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1">
                    <UserPlus className="w-4 h-4" />
                    Let's find friends
                </Link>
            )}
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

                <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
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
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>

                {renderList()}
            </div>
        </aside>
    );
};

export default Sidebar;
