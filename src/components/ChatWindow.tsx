import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image, Send, Smile, Paperclip, Menu, Flag } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import ChatInfo from "@/components/ChatInfo";
import NotesComponent from "@/components/Notes";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
    isMe: boolean;
  };
  recipient: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: string;
}

const socket = io("http://localhost:3001");

interface ChatWindowProps {
  friendId: string | null;
  userId: string | undefined;
  groupId: string | null;
  friendAvatar: string | undefined;
  userName: string;
}

export default function ChatWindow({ friendId, userId, groupId, friendAvatar, userName }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState<"chatInfo" | "notes">("chatInfo");

  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data: { message: Message; friendId: string }) => {
      const { message } = data;
      // Check if message structure is valid
      if (message && message.sender) {
        setMessages((prevMessages) => [...prevMessages, message]);
      } else {
        console.error("Received message is invalid:", data);
      }
    });

    socket.emit("join_chat", { userId, friendId });

    return () => {
      socket.off("receive_message");
    };
  }, [friendId, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: uuidv4(),
      content: newMessage,
      sender: {
        id: userId!,
        name: userName,
        avatar: "https://github.com/shadcn.png",
        isMe: true,
      },
      recipient: {
        id: friendId!,
        name: "",
        avatar: friendAvatar!,
      },
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };

    socket.emit("send_message", { message, friendId });
    setNewMessage("");
  };

  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
    setEmojiPickerOpen(false);
  };

  return (
    <div className="flex w-full">
      <div className="flex flex-col bg-gray-100 rounded-lg flex-1 mr-4 h-[calc(100vh-70px)]">
        <div className="border-b p-4 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <Avatar>
              <img src={friendAvatar} alt="Friend" />
            </Avatar>
            <div>
              <h3 className="font-medium">Friend</h3>
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

        <ScrollArea className="flex-1 p-4 bg-gray-50" ref={scrollRef}>
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
                    <p className="text-xs text-muted-foreground mb-1 text-right">You</p>
                  ) : (
                    <p className="text-xs text-muted-foreground mb-1">{message.sender.name}</p>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2 ${message.sender.id === userId ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <span className="text-[10px] text-gray-500 px-2">{message.timestamp}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="border-t p-4 bg-white relative">
          {emojiPickerOpen && (
            <div className="absolute bottom-16 right-0 ">
              <EmojiPicker onEmojiClick={handleEmojiSelect} />
            </div>
          )}
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
            <Button variant="ghost" size="icon" onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}>
              <Smile className="h-5 w-5 text-gray-500" />
            </Button>
            <Button onClick={handleSendMessage} className="bg-blue-500 text-white">
              Send
            </Button>
          </div>
        </div>
      </div>

      <div className="w-96 flex-shrink-0 border-l pl-4">
        {activeComponent === "chatInfo" ? (
          <ChatInfo
            name="Friend"
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
