
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

const NotificationIcon = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Simulate real-time notifications based on user activities
    const mockNotifications = [
      {
        id: 1,
        message: "Your wire transfer of $2,500 is being processed",
        time: "2 minutes ago",
        type: "transaction"
      },
      {
        id: 2,
        message: "Security alert: New device login detected",
        time: "15 minutes ago",
        type: "security"
      },
      {
        id: 3,
        message: "Monthly statement is now available",
        time: "1 hour ago",
        type: "document"
      }
    ];

    setNotifications(mockNotifications);
  }, [user]);

  const unreadCount = notifications.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
        </div>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
              <div className="text-sm">{notification.message}</div>
              <div className="text-xs text-gray-500 mt-1">{notification.time}</div>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem className="text-center text-gray-500 p-3">
            No new notifications
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationIcon;
