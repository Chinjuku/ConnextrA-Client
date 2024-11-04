import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image, Smile, Paperclip, Menu, Flag } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import ChatInfo from "@/components/ChatInfo";
import NotesComponent from "@/components/Notes";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { User } from "@/types/user.types";
import { Group } from "@/types/group.type";
import { getFriend, getGroup } from "@/api/contact";
import moment from "moment";

interface Message {
  id: string;
  content: string;
  sender: {
    id: number;
    name: string;
    avatar: string;
    isMe: boolean;
  };
  recipient: {
    id: number;
    name: string;
    avatar: string;
  };
  timestamp: string;
}

const socket = io(import.meta.env.VITE_SOCKET_URL);

interface ChatWindowProps {
  friendId: string | null;
  userId: number;
  groupId: string | null;
  userName: string;
}

export default function ChatWindow({
  friendId,
  userId,
  groupId,
  userName,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState<"chatInfo" | "notes">(
    "chatInfo"
  );
  const [friend, setFriend] = useState<User | null>(null);
  const [group, setGroup] = useState<Group | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const friendFullname =
    friend?.given_name || friend?.family_name
      ? friend.given_name + " " + friend.family_name
      : "";
  const friendAvatar = friend?.image_url ? friend.image_url : "";
  const birthday = friend?.date_of_birth
    ? moment(friend.date_of_birth).format("MMMM Do YYYY")
    : "November 11th 2004";

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (friendId) {
      const fetchFriend = async () => {
        const response = await getFriend(Number(friendId));
        setFriend(response);
      };
      fetchFriend();
    } else if (groupId) {
      const fetchFriend = async () => {
        const response = await getGroup(Number(groupId));
        setGroup(response);
      };
      fetchFriend();
    }
  }, [friendId, groupId]);

  useEffect(() => {
    socket.on(
      "receive_message",
      (data: { message: Message; friendId: string }) => {
        const { message } = data;
        // Check if message structure is valid
        if (message && message.sender) {
          setMessages((prevMessages) => [...prevMessages, message]);
        } else {
          console.error("Received message is invalid:", data);
        }
      }
    );

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
        id: Number(friendId)!,
        name: friendFullname,
        avatar: friendAvatar,
      },
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };

    socket.emit("send_message", { message, friendId, groupId });
    setNewMessage("");
  };
  console.log(group);
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
              <img
                src={friendAvatar || "https://via.placeholder.com/150"} // Replace with an actual placeholder URL
                alt={friendAvatar ? "Friend" : group?.name?.[0] || "Group"}
                className="bg-gray-300"
              />
            </Avatar>
            <div>
              <h3 className="font-medium">
                {friend ? friendFullname : group ? group.name : ""}
              </h3>
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
                className={`flex gap-3 ${
                  message.sender.id === userId ? "flex-row-reverse" : "flex-row"
                }`}
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
                    className={`rounded-2xl px-4 py-2 ${
                      message.sender.id === userId
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
            >
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
            group={group}
            name={friendFullname ? friendFullname : ""}
            email={friend?.email ? friend.email : ""}
            location={
              friend ? `${friend?.province || ""} ${friend?.country || ""}` : ""
            }
            avatar={friendAvatar}
            birthday={birthday}
            onNotesClick={() => setActiveComponent("notes")} // Change to notes component
          />
        ) : (
          <NotesComponent onBackClick={() => setActiveComponent("chatInfo")} />
        )}
      </div>
    </div>
  );
}
