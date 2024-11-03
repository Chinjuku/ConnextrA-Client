import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image, Send, Smile, Paperclip, Menu, Flag } from "lucide-react";
import { useEffect, useState } from "react";
import ChatInfo from "@/components/ChatInfo";
import NotesComponent from "@/components/Notes";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from 'uuid'; // Import uuid for unique IDs

interface Message {
  id: string; // Changed to string for UUID
  content: string;
  sender: {
    id: string; // ID ของผู้ส่ง
    name: string;
    avatar: string;
    isMe: boolean;
  };
  recipient: {
    id: string; // ID ของผู้รับ
    name: string; // ชื่อของผู้รับ
    avatar: string; // รูปโปรไฟล์ของผู้รับ
  };
  timestamp: string;
}

// Use an environment variable for the socket URL
const socket = io("http://localhost:3001");

interface ChatWindowProps {
  friendId: string; // ID ของเพื่อน
  userId: string; // ID ของผู้ใช้
  friendAvatar: string; // URL ของรูปโปรไฟล์เพื่อน
  userName: string; // ชื่อผู้ใช้
}

export default function ChatWindow({ friendId, userId, friendAvatar, userName  }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeComponent, setActiveComponent] = useState<"chatInfo" | "notes">("chatInfo");

  useEffect(() => {
    // ฟังการรับข้อความจากเซิร์ฟเวอร์
    socket.on("receive_message", (data: { message: Message; friendId: string }) => {
      const { message } = data;
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // ฟังเมื่อมีการเชื่อมต่อใหม่
    socket.emit("join_chat", { userId, friendId }); // ส่งข้อมูลเพื่อเข้าร่วมการแชท

    return () => {
      socket.off("receive_message");
    };
  }, [friendId, userId]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: uuidv4(), // Use UUID for unique message IDs
      content: newMessage,
      sender: {
        id: userId,
        name: userName,
        avatar: "https://github.com/shadcn.png",
        isMe: true,
      },
      recipient: {
        id: friendId,
        name: "", // Removed friend name
        avatar: friendAvatar, // Use the friend's avatar from props
      },
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };

    // ส่งข้อความไปยังเซิร์ฟเวอร์
    socket.emit("send_message", { message, friendId });
    setNewMessage("");
  };

  return (
    <div className="flex w-full">
      <div className="flex flex-col bg-gray-100 rounded-lg flex-1 mr-4">
        {/* Header */}
        <div className="border-b p-4 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <Avatar>
              <img src={friendAvatar} alt="Friend" /> {/* Dynamic friend avatar */}
            </Avatar>
            <div>
              <h3 className="font-medium">Friend</h3> {/* Static name or dynamic if needed */}
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

        {/* Messages */}
        <ScrollArea className="flex-1 p-4 bg-gray-50">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender.id === userId ? "flex-row-reverse" : "flex-row"}`}
              >
                <Avatar className="w-8 h-8">
                  <img src={message.sender.avatar} alt={message.sender.name} />
                </Avatar>
                <div className={`group relative max-w-[75%]`}>
                  {message.sender.id === userId ? (
                    <p className="text-xs text-muted-foreground mb-1 text-right">
                      You
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground mb-1">
                      {message.sender.name}
                    </p>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2 ${message.sender.id === userId ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
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

        {/* Message Input */}
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
            <Button onClick={handleSendMessage} className="bg-blue-500 text-white">
              Send
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Info or Notes */}
      <div className="w-96 flex-shrink-0 border-l pl-4">
        {activeComponent === "chatInfo" ? (
          <ChatInfo
            name="Friend" // Static name or use an appropriate dynamic name if needed
            email="pleo2003@gmail.com"
            location="Bangkok, Thailand"
            birthday="9 Aug, 2003"
            onNotesClick={() => setActiveComponent("notes")}
          />
        ) : (
          <NotesComponent onBackClick={() => setActiveComponent("chatInfo")} />
        )}
      </div>
    </div>
  );
}
