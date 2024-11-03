import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image, Send, Smile, Paperclip, Menu, Flag } from "lucide-react";
import { useEffect, useState } from "react";
import ChatInfo from "@/components/ChatInfo"; // Import ChatInfo
import NotesComponent from "@/components/Notes"; // Import Notes component
import { getFriend, getGroup } from "@/api/contact";
import { User } from "@/types/user.types";
import { Group } from "@/types/group.type";

interface Message {
  id: number;
  content: string;
  sender: {
    name: string;
    avatar: string;
    isMe: boolean;
  };
  timestamp: string;
}

interface UserData {
  id: number;
  name: string;
  avatar: string;
  email: string;
  location: string;
  birthday: string;
}

// สมมติว่า userData มาจาก props
interface ChatWindowProps {
  userData: UserData;
}

const socket = io("http://localhost:3001");

export default function ChatWindow({ userData }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeComponent, setActiveComponent] = useState<"chatInfo" | "notes">("chatInfo");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("receive_message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: messages.length + 1,
      content: newMessage,
      sender: {
        name: userData.name, // ใช้ชื่อผู้ใช้จาก userData
        avatar: userData.avatar, // ใช้ URL อวตาร์จาก userData
        isMe: true,
      },
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };

    socket.emit("send_message", message);
    setNewMessage("");
  };

  return (
    <div className="flex w-full">
      <div className="flex flex-col bg-gray-100 rounded-lg flex-1 mr-4">
        <div className="border-b p-4 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <Avatar>
              <img src={userData.avatar} alt="Contact" /> {/* แสดงอวตาร์ของผู้ใช้ */}
            </Avatar>
            <div>
              <h3 className="font-medium">{
                friend ? friend?.given_name + " " + friend?.given_name :
                group ? group?.name : ""

                }</h3>
              <span className="text-xs text-green-500">● Online</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Flag className="h-5 w-5 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4 bg-gray-50">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender.isMe ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Avatar className="w-8 h-8">
                  <img src={message.sender.avatar} alt={message.sender.name} />
                </Avatar>
                <div className={`group relative max-w-[75%]`}>
                  {!message.sender.isMe && (
                    <p className="text-xs text-muted-foreground mb-1">
                      {message.sender.name}
                    </p>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      message.sender.isMe
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <span className="text-[10px] text-gray-500 px-2">
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t p-4 bg-white">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-5 w-5 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon">
              <Image className="h-5 w-5 text-gray-500" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              placeholder="Type a message..."
              className="flex-1 bg-gray-100 border-none focus:ring-0"
            />
            <Button variant="ghost" size="icon">
              <Smile className="h-5 w-5 text-gray-500" />
            </Button>
            <Button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white"
            >
              Send
            </Button>
          </div>
        </div>
      </div>

      <div className="w-96 flex-shrink-0 border-l pl-4">
        {activeComponent === "chatInfo" ? (
          <ChatInfo
            name={friend ? `${friend?.given_name} ${friend?.given_name}` : `${group?.name}`}
            email={friend ? `${friend?.email}` : ""}
            location={friend ? `${friend?.province || "" } ${friend?.country || ""}` : ""}
            birthday={friend ? `${friend?.date_of_birth}` : ""}
            onNotesClick={() => setActiveComponent("notes")} // Change to notes component
          />
        ) : (
          <NotesComponent onBackClick={() => setActiveComponent("chatInfo")} />
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
