import { getFriend } from "@/api/contact";
import { UserContext } from "@/context/UserContext";
import { Messages } from "@/types/message.types";
import { User } from "@/types/user.types";
import { Avatar } from "@radix-ui/react-avatar";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";

type Message = {
  message: Messages
  userId: number
  friend: User | null
  groupId: string | null
}

export const ChatItem = ({ message, userId, friend, groupId }: Message ) => {
  const { userData } = useContext(UserContext);
  const [friendinside, setFriend] = useState<User | null>()
  
  useEffect(() => {
    if (groupId) {
      const fetchUser = async () => {
        const res = await getFriend(Number(message.senderId))
        setFriend(res)
      }
      fetchUser()
    } else {
      setFriend(friend)
    }
  }, [friend, groupId, message.senderId])
  return (
    <div
      key={message.messageId}
      className={`flex gap-3 ${
        Number(message.senderId) === userId ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {Number(message.senderId) === userId ? (
        <Avatar className="w-8 h-8 rounded-full">
          <img className="rounded-full" src={userData?.image_url} alt={`${userData?.given_name}`} />
        </Avatar>
      ) : (
        <Avatar className="w-8 h-8 rounded-full">
          <img className="rounded-full" src={friendinside?.image_url} alt={`${friendinside?.given_name}`} />
        </Avatar>
      )}
      <div className={`group relative max-w-[75%]`}>
        {Number(message.senderId) === userId ? (
          <p className="text-xs text-muted-foreground mb-1 text-right">You</p>
        ) : (
          <p className="text-xs text-muted-foreground mb-1">
            {friendinside?.given_name} {friendinside?.family_name}
          </p>
        )}
        <div
          className={`rounded-2xl px-4 py-2 ${
            Number(message.senderId) === userId
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        <span className="text-[10px] text-gray-500 px-2">
          {moment(message.timestamp).format("H:m")}
        </span>
      </div>
    </div>
  );
};
