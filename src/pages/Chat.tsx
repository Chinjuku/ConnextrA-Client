import React, { useState } from "react";
import Navigation from '@/components/Nav';
import ChatWindow from "@/components/ChatWindow";
import Sidebar from "@/components/SidebarChat";
import { MessageSquare } from "lucide-react";

export default function Chat() {
    const [isChatOpen, setIsChatOpen] = useState(false); // Toggle chat window
    const [selectedFriend, setSelectedFriend] = useState<string | null>(null); // Track selected friend

    const handleFriendSelect = (friendName: string) => {
        setSelectedFriend(friendName); // Update selected friend
        setIsChatOpen(true); // Open chat window
    };

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* Navigation Bar */}
            <Navigation />

            <div className="flex flex-grow container mx-auto px-4">
                {/* Sidebar */}
                <Sidebar onFriendSelect={handleFriendSelect} />

                {/* Main Content */}
                <main className="flex-1 flex">
                    {!isChatOpen ? (
                        <div className="flex-1 flex items-center justify-center text-gray-300 text-center">
                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-2 text-4xl font-bold mb-2">
                                    <MessageSquare className="w-10 h-10" />
                                    Connextra
                                </div>
                                <p>Select a chat to start messaging</p>
                            </div>
                        </div>
                    ) : (
                        <ChatWindow userData={userData} /> // Pass the selected friend to ChatWindow
                    )}
                </main>
            </div>
        </div>
    );
}
