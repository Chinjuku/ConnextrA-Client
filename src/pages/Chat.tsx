import { useEffect, useState, useContext, Suspense, lazy } from "react";
import { UserContext } from "@/context/UserContext";
import { MessageSquare } from "lucide-react";

// Lazy load components
const Navigation = lazy(() => import('@/components/Nav'));
const ChatWindow = lazy(() => import('@/components/ChatWindow'));
const Sidebar = lazy(() => import('@/components/SidebarChat'));

export default function Chat() {
    const { userData } = useContext(UserContext);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const urlParams = new URLSearchParams(window.location.search);
    const friendId = urlParams.get('friendId');
    const groupId = urlParams.get('groupId');
    const blockId = urlParams.get('blockId');
    const userName = `${userData?.given_name + " " + userData?.family_name}`;
    const id = userData?.id ? userData.id : 0;

    useEffect(() => {
        setIsChatOpen(!!(friendId || groupId || blockId));
    }, [friendId, groupId, blockId]);

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            <Suspense fallback={<div>Loading...</div>}>
                <Navigation />
                <div className="flex flex-grow container mx-auto px-4">
                    <Suspense fallback={<div>Loading sidebar...</div>}>
                        <Sidebar
                            friendId={friendId}
                            groupId={groupId}
                            blockId={blockId}
                            userId={userData?.id}
                        />
                    </Suspense>
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
                            <Suspense fallback={<div>Loading chat...</div>}>
                                <ChatWindow
                                    friendId={friendId}
                                    groupId={groupId}
                                    userName={userName} // ส่ง given_name มาด้วย
                                />
                            </Suspense>
                        )}
                    </main>
                </div>
            </Suspense>
        </div>
    );
}
