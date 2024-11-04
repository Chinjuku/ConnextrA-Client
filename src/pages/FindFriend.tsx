import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Search, HeartCrack } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import Navigation from "@/components/Nav";
import { User } from "@/types/user.types";
import { getNotFriends, addFriend, getAllFriends } from "@/api/user";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loading from "@/components/Loading";

export default function FindFriend() {
  const { userId } = useParams();
  const [notFriends, setNotFriends] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchContext, setSearchContext] = useState("friends");
  const [searchTermFriends, setSearchTermFriends] = useState("");
  const [searchTermNotFriends, setSearchTermNotFriends] = useState("");
  const [debouncedSearchTermFriends, setDebouncedSearchTermFriends] = useState(searchTermFriends);
  const [debouncedSearchTermNotFriends, setDebouncedSearchTermNotFriends] = useState(searchTermNotFriends);

  // Debounce search terms
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchContext === "friends") {
        setDebouncedSearchTermFriends(searchTermFriends);
      } else {
        setDebouncedSearchTermNotFriends(searchTermNotFriends);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTermFriends, searchTermNotFriends, searchContext]);

  // Fetch friends and not friends data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [users, friendsList] = await Promise.all([
          getNotFriends(Number(userId)),
          getAllFriends(Number(userId)),
        ]);
        setNotFriends(users);
        setFriends(friendsList);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleAddFriend = async (friendId: number) => {
    try {
      await addFriend(Number(userId), friendId);
      setNotFriends((prevNotFriends) => prevNotFriends.filter(user => user.id !== friendId));
      const newFriend = notFriends.find(user => user.id === friendId);
      if (newFriend) {
        setFriends((prevFriends) => [...prevFriends, newFriend]);
      }
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  const handleContextChange = (context: string) => {
    setSearchContext(context);
    if (context === "friends") {
      setSearchTermNotFriends(""); // Clear Friend Suggestions search term
    } else {
      setSearchTermFriends(""); // Clear Recent Friends search term
    }
  };

  const filteredFriends = friends.filter(user =>
    (user.given_name?.toLowerCase().includes(debouncedSearchTermFriends.toLowerCase()) ||
      user.family_name?.toLowerCase().includes(debouncedSearchTermFriends.toLowerCase())) ?? false
  );

  const filteredNotFriends = notFriends.filter(user =>
    (user.given_name?.toLowerCase().includes(debouncedSearchTermNotFriends.toLowerCase()) ||
      user.family_name?.toLowerCase().includes(debouncedSearchTermNotFriends.toLowerCase())) ?? false
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      <Navigation />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-80 border-r pt-4 pr-4">
            <div className="flex justify-center space-x-5 mb-4 bg-gray-50">
              <Tabs defaultValue="friends" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="friends" onClick={() => handleContextChange("friends")}>
                    Recent Friends
                  </TabsTrigger>
                  <TabsTrigger value="notFriends" onClick={() => handleContextChange("notFriends")}>
                    Friend Suggestions
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {searchContext === "friends" && (
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search Recent Friends"
                  className="pl-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition duration-150 ease-in-out"
                  value={searchTermFriends}
                  onChange={(e) => setSearchTermFriends(e.target.value)}
                />
              </div>
            )}
            {searchContext === "notFriends" && (
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search Friend Suggestions"
                  className="pl-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition duration-150 ease-in-out"
                  value={searchTermNotFriends}
                  onChange={(e) => setSearchTermNotFriends(e.target.value)}
                />
              </div>
            )}

            <div>
              <h2 className="font-semibold mb-4 text-indigo-700 text-lg">Recent Friends</h2>
              <div className="space-y-2">
                {filteredFriends.map((friend) => (
                  <div key={friend.id} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer transition duration-150">
                    <Avatar className="w-8 h-8">
                      <img src={friend.image_url} alt={`${friend.given_name ?? ''} ${friend.family_name ?? ''}`} />
                    </Avatar>
                    <span className="text-sm font-medium text-gray-800">{friend.given_name ?? ''} {friend.family_name ?? ''}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="font-semibold text-indigo-700 mb-4">Friend Suggestions</h2>
            {filteredNotFriends.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[500px]">
                <HeartCrack className="h-16 w-16 text-gray-300 mb-2 opacity-75" />
                <span className="text-lg text-gray-300 opacity-75">No friends found to search.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotFriends.map((user) => (
                  <div key={user.id} className="bg-white p-4 rounded-lg shadow-lg transition transform hover:shadow-xl flex flex-col items-center justify-center">
                    <Avatar className="w-20 h-20 mb-3 flex justify-center items-center">
                      <img src={user.image_url} alt={`${user.given_name ?? ''} ${user.family_name ?? ''}`} loading="lazy" />
                    </Avatar>
                    <h3 className="font-medium mb-2 text-center">{user.given_name ?? ''} {user.family_name ?? ''}</h3>
                    <Button
                      variant="outline"
                      className="w-full hover:bg-indigo-700 hover:text-white transition duration-150"
                      onClick={() => handleAddFriend(user.id)}
                    >
                      Add friend
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
