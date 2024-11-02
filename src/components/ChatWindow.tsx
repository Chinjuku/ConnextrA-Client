import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image, Send, Smile, Paperclip, Menu, Flag } from "lucide-react";
import { useState } from "react";

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

export default function ChatConversation() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hi, how are you?",
      sender: {
        name: "John Doe",
        avatar: "https://github.com/shadcn.png",
        isMe: false,
      },
      timestamp: "09:41",
    },
    {
      id: 2,
      content: "I'm good, thanks! How about you?",
      sender: {
        name: "You",
        avatar: "https://github.com/shadcn.png",
        isMe: true,
      },
      timestamp: "09:42",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: messages.length + 1,
      content: newMessage,
      sender: {
        name: "You",
        avatar: "https://github.com/shadcn.png",
        isMe: true,
      },
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col bg-gray-100 rounded-lg w-[800px]">
      {/* Chat Header */}
      <div className="border-b p-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <Avatar>
            <img src="https://github.com/shadcn.png" alt="Contact" />
          </Avatar>
          <div>
            <h3 className="font-medium">John Doe</h3>
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

      {/* Messages Area */}
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
              <div className={`group relative max-w-[70%]`}>
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

      {/* Input Area */}
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
            size="icon"
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
