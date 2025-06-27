
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertTriangle, CheckCircle, Info, DollarSign, Shield, Trash2, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NotificationsCenter = () => {
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "security",
      title: "New Device Login",
      message: "Your account was accessed from a new device in Boston, MA",
      time: "10 minutes ago",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      unread: true,
      category: "security"
    },
    {
      id: 2,
      type: "transaction",
      title: "Wire Transfer Successful",
      message: "Your wire transfer of $2,500 to John Smith has been completed",
      time: "2 hours ago",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      unread: true,
      category: "transaction"
    },
    {
      id: 3,
      type: "security",
      title: "Account Sign-in Alert",
      message: "Someone signed in to your account from New York, NY",
      time: "5 hours ago",
      icon: Shield,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      unread: true,
      category: "security"
    },
    {
      id: 4,
      type: "transaction",
      title: "ACH Transfer Completed",
      message: "Your ACH transfer of $1,200 has been processed successfully",
      time: "1 day ago",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      unread: false,
      category: "transaction"
    },
    {
      id: 5,
      type: "security",
      title: "Two-Factor Authentication Enabled",
      message: "Two-factor authentication has been activated on your account",
      time: "2 days ago",
      icon: Shield,
      color: "text-green-600",
      bgColor: "bg-green-50",
      unread: false,
      category: "security"
    },
  ]);

  const [filter, setFilter] = useState("all");
  const unreadCount = notifications.filter(n => n.unread).length;

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
    return true;
  });

  return (
    <div className="space-y-6">
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
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            Mark All Read
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearOldNotifications}>
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
          <Card key={notification.id} className={`${notification.unread ? 'ring-2 ring-blue-200' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 ${notification.bgColor} rounded-lg flex items-center justify-center`}>
                  <notification.icon className={`h-5 w-5 ${notification.color}`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`font-semibold ${notification.unread ? 'text-banking-navy' : 'text-gray-700'}`}>
                        {notification.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                      <p className="text-gray-400 text-xs mt-2">{notification.time}</p>
                    </div>
                    
                    {notification.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">You're all caught up! No new notifications to show.</p>
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
