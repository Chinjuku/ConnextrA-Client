import { useContext } from "react";
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logout } from '@/components/Logout';
import { UserContext } from "@/context/UserContext";

const Navigation = () => {
  const { userData, isAuthenticated } = useContext(UserContext);
  const location = useLocation();
  const userId = userData?.id; // สมมติว่า userData มี userId อยู่

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-200 rounded-full flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-indigo-950" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-indigo-950">Connextra</h1>
            <p className="text-xs text-muted-foreground">create for cloud-computing project</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/chat"
            className={`pb-1 font-medium ${
              location.pathname === '/chat' 
                ? 'text-indigo-950 border-b-2 border-indigo-950' 
                : 'text-muted-foreground hover:text-indigo-950'
            }`}
          >
            Chat
          </Link>
          <Link
            to={`/find-friend/${userId}`} // ใช้ userId ในลิงก์
            className={`pb-1 font-medium ${
              location.pathname.startsWith('/find-friend') // เปลี่ยนเพื่อรองรับพาธที่มี userId
                ? 'text-indigo-950 border-b-2 border-indigo-950' 
                : 'text-muted-foreground hover:text-indigo-950'
            }`}
          >
            Find Friend
          </Link>
          <Link
            to="/find-group"
            className={`pb-1 font-medium ${
              location.pathname === '/find-group' 
                ? 'text-indigo-950 border-b-2 border-indigo-950' 
                : 'text-muted-foreground hover:text-indigo-950'
            }`}
          >
            Find Group
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to='/profile'><DropdownMenuItem className='cursor-pointer'>Profile</DropdownMenuItem></Link>
              <Link to="/dashboard"><DropdownMenuItem className='cursor-pointer'>Dashboard</DropdownMenuItem></Link>
              <Logout />
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={userData?.image_url || "/placeholder-user.jpg"} alt={userData?.given_name || "User"} />
              <AvatarFallback>{userData?.given_name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
            <p className="font-medium">
  {userData?.given_name + ' ' + userData?.family_name || "User"}
</p>
              <p className="text-xs text-muted-foreground">{userData?.email || "User Email"}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
