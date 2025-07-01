
import { useState, useEffect } from "react";
import { Bell, X, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'welcome' | 'security' | 'transaction' | 'system';
  isRead: boolean;
}

const NotificationIcon = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      initializeNotifications();
    }
  }, [user]);

  const initializeNotifications = async () => {
    if (!user) return;

    try {
      // Get user profile information
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email, account_number, created_at, balance')
        .eq('id', user.id)
        .single();

      if (profile) {
        // Check if this is a new user (created within last 24 hours)
        const accountAge = new Date().getTime() - new Date(profile.created_at).getTime();
        const isNewUser = accountAge < 24 * 60 * 60 * 1000;

        const welcomeNotifications: Notification[] = [];

        if (isNewUser) {
          // Welcome notification for new users
          welcomeNotifications.push({
            id: `welcome-${Date.now()}`,
            title: "🎉 Welcome to UnionTrust Capital!",
            message: `Thank you ${profile.full_name} for opening your premium banking account! Your account ${profile.account_number} is now active with a balance of $${profile.balance?.toLocaleString() || '5,000'}.`,
            time: "Just now",
            type: "welcome",
            isRead: false
          });

          // Account setup notification
          welcomeNotifications.push({
            id: `setup-${Date.now() + 1}`,
            title: "Account Setup Complete",
            message: "Your premium banking features are now activated. Enjoy secure transfers, premium support, and exclusive benefits.",
            time: "1 minute ago",
            type: "system",
            isRead: false
          });
        }

        // Add some sample activity notifications
        const activityNotifications: Notification[] = [
          {
            id: `security-${Date.now() + 2}`,
            title: "Security Update",
            message: "Your account security has been enhanced with two-factor authentication.",
            time: "2 hours ago",
            type: "security",
            isRead: false
          }
        ];

        setNotifications([...welcomeNotifications, ...activityNotifications]);
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'welcome': return 'text-green-600 bg-green-50';
      case 'security': return 'text-red-600 bg-red-50';
      case 'transaction': return 'text-blue-600 bg-blue-50';
      case 'system': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-white/20 transition-all duration-200">
          <Bell className="h-5 w-5 text-slate-700" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 p-0 shadow-2xl border-0">
        <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 backdrop-blur-xl rounded-lg">
          {/* Header */}
          <div className="p-4 border-b border-slate-200/50">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                    {unreadCount} new
                  </Badge>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="text-xs hover:bg-white/50"
                >
                  Mark all read
                </Button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div key={notification.id} className="p-3 border-b border-slate-100/50 last:border-b-0">
                  <Card className={`${notification.isRead ? 'bg-white/50' : 'bg-white/80'} shadow-sm border-0 transition-all duration-200 hover:shadow-md`}>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-2 h-2 rounded-full ${getTypeColor(notification.type).split(' ')[1]}`}></div>
                            <h4 className={`font-semibold text-sm ${notification.isRead ? 'text-slate-600' : 'text-slate-800'}`}>
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-400 mt-2">
                            {notification.time}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-8 w-8 p-0 hover:bg-white/80"
                          >
                            {notification.isRead ? (
                              <EyeOff className="h-3 w-3 text-slate-400" />
                            ) : (
                              <Eye className="h-3 w-3 text-blue-600" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-600 mb-2">No notifications</h3>
                <p className="text-slate-500 text-sm">
                  You're all caught up! New notifications will appear here.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-200/50">
            <Button 
              variant="ghost" 
              className="w-full text-sm text-slate-600 hover:bg-white/50"
              onClick={() => {/* Navigate to notifications center */}}
            >
              View All Notifications
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationIcon;
