import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertTriangle, CheckCircle, Info, DollarSign, Shield, Trash2, Settings, PartyPopper, UserCheck, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { mockDataService } from "@/services/mockDataService";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  icon: any;
  color: string;
  bgColor: string;
  unread: boolean;
  category: string;
}

const NotificationsCenter = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (user) {
      initializeNotifications();
    }
  }, [user]);

  const initializeNotifications = async () => {
    if (!user) return;

    try {
      // Get user profile information
      const { data: profile } = await mockDataService.getProfile(user.id);

      if (profile) {
        // Check if this is a new user (created within last 24 hours)
        const accountAge = new Date().getTime() - new Date(profile.created_at).getTime();
        const isNewUser = accountAge < 24 * 60 * 60 * 1000;

        const welcomeNotifications: NotificationItem[] = [];

        if (isNewUser) {
          // Welcome notification for new users
          welcomeNotifications.push({
            id: `welcome-${Date.now()}`,
            type: "welcome",
            title: "🎉 Welcome to UnionTrust Capital!",
            message: `Congratulations ${profile.full_name}! Your premium account ${profile.account_number} has been successfully created with an initial balance of $${profile.balance?.toLocaleString() || '5,000'}.`,
            time: "Just now",
            icon: PartyPopper,
            color: "text-green-600",
            bgColor: "bg-green-50",
            unread: true,
            category: "welcome"
          });

          // Account verification notification
          welcomeNotifications.push({
            id: `verification-${Date.now() + 1}`,
            type: "security",
            title: "Account Verified Successfully",
            message: "Your identity has been verified and your premium banking features are now active.",
            time: "2 minutes ago",
            icon: UserCheck,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            unread: true,
            category: "security"
          });
        }

        // Add sample activity notifications
        const activityNotifications: NotificationItem[] = [
          {
            id: `security-${Date.now() + 2}`,
            type: "security",
            title: "Security Enhancement Applied",
            message: "Two-factor authentication has been enabled for your account security.",
            time: "1 hour ago",
            icon: Shield,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            unread: false,
            category: "security"
          }
        ];

        setNotifications([...welcomeNotifications, ...activityNotifications]);
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const toggleReadStatus = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, unread: !n.unread } : n)
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast({
      title: "Notification deleted",
      description: "The notification has been removed.",
    });
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    toast({
      title: "All notifications marked as read",
      description: "Your notification list has been updated.",
    });
  };

  const handleClearOldNotifications = () => {
    setNotifications(prev => prev.filter(n => n.unread || n.time.includes("minutes") || n.time.includes("hours")));
    toast({
      title: "Old notifications cleared",
      description: "Previous notifications have been removed.",
    });
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true;
    if (filter === "security") return notification.category === "security";
    if (filter === "transaction") return notification.category === "transaction";
    if (filter === "welcome") return notification.category === "welcome";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* ... keep existing code (header and filter sections) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-banking-navy">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
            Mark All Read
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearOldNotifications} disabled={notifications.length === 0}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Old
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        <Button 
          variant={filter === "all" ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter("all")}
        >
          All Notifications
        </Button>
        <Button 
          variant={filter === "welcome" ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter("welcome")}
        >
          <PartyPopper className="h-4 w-4 mr-2" />
          Welcome
        </Button>
        <Button 
          variant={filter === "security" ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter("security")}
        >
          <Shield className="h-4 w-4 mr-2" />
          Security Events
        </Button>
        <Button 
          variant={filter === "transaction" ? "default" : "outline"} 
          size="sm"
          onClick={() => setFilter("transaction")}
        >
          <DollarSign className="h-4 w-4 mr-2" />
          Transactions
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredNotifications.map((notification) => (
          <Card key={notification.id} className={`${notification.unread ? 'ring-2 ring-blue-200 bg-blue-50/30' : 'bg-white'} transition-all duration-200 hover:shadow-lg`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 ${notification.bgColor} rounded-lg flex items-center justify-center`}>
                  <notification.icon className={`h-5 w-5 ${notification.color}`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-semibold ${notification.unread ? 'text-banking-navy' : 'text-gray-700'}`}>
                        {notification.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                      <p className="text-gray-400 text-xs mt-2">{notification.time}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleReadStatus(notification.id)}
                        className="h-8 w-8 p-0"
                      >
                        {notification.unread ? (
                          <Eye className="h-4 w-4 text-blue-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="h-8 w-8 p-0 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ... keep existing code (empty state and notification settings) */}
      {filteredNotifications.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">
              {notifications.length === 0 
                ? "Welcome! Your notifications will appear here as you use your account." 
                : "You're all caught up! No new notifications to show."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Security Events</h4>
              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  New device sign-ins
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  Account registration alerts
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  Suspicious activity warnings
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  Failed login attempts
                </label>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Transaction Alerts</h4>
              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  Successful transfers
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  Large transactions ($1,000+)
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  All account activity
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  Low balance warnings
                </label>
              </div>
            </div>
          </div>
          
          <Button className="mt-6" onClick={() => toast({
            title: "Preferences Saved",
            description: "Your notification settings have been updated successfully.",
          })}>
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsCenter;
