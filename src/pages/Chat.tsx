import React, { useEffect, useState } from "react";
import Navigation from '@/components/Nav';
import ChatWindow from "@/components/ChatWindow";
import Sidebar from "@/components/SidebarChat";
import { MessageSquare } from "lucide-react";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";

export default function Chat() {
    const { userData } = useContext(UserContext)
    const [isChatOpen, setIsChatOpen] = useState(false); // Toggle chat window
    // const [selectedFriend, setSelectedFriend] = useState<string | null>(null); // Track selected friend
    const urlParams = new URLSearchParams(window.location.search);
    const friendId = urlParams.get('friendId');
    const groupId = urlParams.get('groupId');
    const blockId = urlParams.get('blockId');
    console.log(friendId, groupId, blockId);
    useEffect(() => {
      if (friendId || groupId || blockId) {
        setIsChatOpen(true)
      }
    }, [friendId, groupId, blockId])

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            {/* Navigation Bar */}
            <Navigation />

            <div className="flex flex-grow container mx-auto px-4">
                {/* Sidebar */}
                <Sidebar 
                  friendId={friendId} 
                  groupId={groupId} 
                  blockId={blockId}
                  userId={userData?.id} 
                />

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
                        <ChatWindow 
                          friendId={friendId} 
                          groupId={groupId} 
                          userId={userData?.id} 
                        /> // Pass the selected friend to ChatWindow
                    )}
                </main>
            </div>
        </div>
    );
}
