// ChatInfo.tsx
import { MapPin, Mail, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Group } from "@/types/group.type";

interface ChatInfoProps {
  group: Group | null;
  name: string;
  email: string;
  location: string;
  birthday: string;
  avatar: string;
  onNotesClick: () => void; // Function to switch to notes
}

export default function ChatInfo({
  group,
  name,
  email,
  location,
  birthday,
  avatar,
  onNotesClick,
}: ChatInfoProps) {
  return (
    <Card className="w-full bg-gray-50 h-full flex flex-col border-0 shadow-none">
      <CardContent className="flex flex-col items-center justify-between h-full p-6">
        {/* Avatar and User Info */}
        {group ? (
          <></>
        ) : (
          <div className="flex flex-col items-center mb-6 text-center">
            {avatar ? (
              <img
                src={avatar}
                className="object-cover w-20 h-20 rounded-full flex items-center justify-center"
              ></img>
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-4xl font-semibold text-white">
                  {name.charAt(0)}
                </span>
              </div>
            )}

            <h2 className="mt-4 font-bold text-2xl text-gray-800">{name}</h2>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-1">
              <Mail className="w-4 h-4" />
              <span>{email}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-1">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">{birthday}</div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 w-full">
          {renderButton(
            <FileText className="w-4 h-4 text-gray-700" />,
            "Notes",
            onNotesClick
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to render buttons
const renderButton = (
  icon: JSX.Element,
  label: string,
  onClick: () => void
) => (
  <Button
    variant="outline"
    className="w-full justify-center gap-2 hover:bg-gray-100 transition duration-200"
    onClick={onClick} // Correctly passes the function reference
  >
    {icon}
    <span className="text-gray-700">{label}</span>
  </Button>
);
