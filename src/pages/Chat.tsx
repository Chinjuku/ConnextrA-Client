import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Search, MessageSquare, Users, UserPlus } from "lucide-react";
import Navigation from '@/components/Nav';
import ChatWindow from "@/components/ChatWindow";

export default function Chat() {
  const [isChatOpen, setIsChatOpen] = useState(false); // Toggle chat window
  const friends: [] = []; // Replace with your friends' data

  const renderFriendList = () => {
    return friends.length > 0 ? (
      <ul className="flex flex-col gap-3">
        {friends.map(friend => (
          <li
            key={friend.id} // Assume friend has an id
            className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-200"
            onClick={() => setIsChatOpen(true)}
          >
            <Users className="w-6 h-6 text-gray-600" />
            <p className="text-sm font-medium">{friend.name}</p>
          </li>
        ))}
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
      <p className="text-sm text-muted-foreground mb-2">You don't have any friends.</p>
      <Link
        to="/find-friend"
        className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
      >
        <UserPlus className="w-4 h-4" />
        Let's find friends
      </Link>
    </div>
  );

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Navigation Bar */}
      <Navigation />

      <div className="flex flex-grow container mx-auto px-4">
        {/* Sidebar */}
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
              <Input placeholder="Search" className="pl-10" />
            </div>

            {/* Chat List or Empty State */}
            {renderFriendList()}
          </div>
        </aside>

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
            <ChatWindow />
          )}
        </main>
      </div>
    </div>
  );
}
