
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertTriangle, CheckCircle, Info, DollarSign } from "lucide-react";

const NotificationsCenter = () => {
  const notifications = [
    {
      id: 1,
      type: "transaction",
      title: "Large Transaction Alert",
      message: "A withdrawal of $2,500 was made from your checking account",
      time: "10 minutes ago",
      icon: DollarSign,
      color: "text-red-600",
      bgColor: "bg-red-50",
      unread: true,
    },
    {
      id: 2,
      type: "security",
      title: "New Device Login",
      message: "Your account was accessed from a new device in Boston, MA",
      time: "2 hours ago",
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      unread: true,
    },
    {
      id: 3,
      type: "promotion",
      title: "Special Offer Available",
      message: "You're pre-approved for a 0% APR credit card with $5,000 limit",
      time: "1 day ago",
      icon: Info,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      unread: false,
    },
    {
      id: 4,
      type: "transaction",
      title: "Payment Successful",
      message: "Your electric bill payment of $125 has been processed",
      time: "2 days ago",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      unread: false,
    },
    {
      id: 5,
      type: "security",
      title: "Password Changed",
      message: "Your account password was successfully updated",
      time: "1 week ago",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

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
          <Button variant="outline" size="sm">
            Mark All Read
          </Button>
          <Button variant="outline" size="sm">
            Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {notifications.map((notification) => (
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

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Transaction Alerts</h4>
              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  Large transactions ($1,000+)
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  Low balance warnings
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  All transactions
                </label>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Security Alerts</h4>
              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  New device logins
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  Password changes
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  Failed login attempts
                </label>
              </div>
            </div>
          </div>
          
          <Button className="mt-6">
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsCenter;
