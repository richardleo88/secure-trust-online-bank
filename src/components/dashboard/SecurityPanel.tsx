
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Shield, Smartphone, Monitor, AlertTriangle, CheckCircle, Trash2, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SecurityPanel = () => {
  const { toast } = useToast();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  // Get current device info
  const getCurrentDevice = () => {
    const userAgent = navigator.userAgent;
    let deviceName = "Unknown Device";
    
    if (/iPhone/.test(userAgent)) deviceName = "iPhone";
    else if (/iPad/.test(userAgent)) deviceName = "iPad";
    else if (/Android/.test(userAgent)) deviceName = "Android Device";
    else if (/Windows/.test(userAgent)) deviceName = "Windows PC";
    else if (/Mac/.test(userAgent)) deviceName = "MacBook";
    else if (/Linux/.test(userAgent)) deviceName = "Linux PC";
    
    return deviceName;
  };

  const [loginHistory, setLoginHistory] = useState([
    { 
      id: 1,
      device: getCurrentDevice(), 
      location: "New York, NY", 
      time: "Current session", 
      status: "current",
      trusted: true 
    },
    { 
      id: 2,
      device: "Chrome Browser", 
      location: "New York, NY", 
      time: "2 hours ago", 
      status: "success",
      trusted: false 
    },
    { 
      id: 3,
      device: "Safari Browser", 
      location: "Boston, MA", 
      time: "1 day ago", 
      status: "suspicious",
      trusted: false 
    },
  ]);

  const securityScore = 75;

  const handleClearLoginHistory = () => {
    setLoginHistory(prev => prev.filter(login => login.status === "current"));
    toast({
      title: "Login History Cleared",
      description: "Previous device login history has been cleared successfully.",
    });
  };

  const handleActivateCurrentDevice = () => {
    setLoginHistory(prev => 
      prev.map(login => 
        login.status === "current" 
          ? { ...login, trusted: true }
          : login
      )
    );
    toast({
      title: "Device Activated",
      description: "Current device has been set as trusted.",
    });
  };

  const handleToggle2FA = (enabled: boolean) => {
    setTwoFactorEnabled(enabled);
    toast({
      title: enabled ? "2FA Enabled" : "2FA Disabled",
      description: enabled 
        ? "Two-factor authentication has been activated for enhanced security."
        : "Two-factor authentication has been disabled.",
    });
  };

  const handleEmailAlertsToggle = (enabled: boolean) => {
    setEmailAlerts(enabled);
    toast({
      title: enabled ? "Email Alerts Enabled" : "Email Alerts Disabled",
      description: enabled 
        ? "You will receive email notifications for account sign-ins and new registrations."
        : "Email notifications have been disabled.",
    });
  };

  const handleSMSAlertsToggle = (enabled: boolean) => {
    setSmsAlerts(enabled);
    toast({
      title: enabled ? "SMS Alerts Enabled" : "SMS Alerts Disabled",
      description: enabled 
        ? "You will receive SMS notifications for account sign-ups."
        : "SMS notifications have been disabled.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-banking-navy">Security Center</h2>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-500" />
          <span className="font-semibold text-green-600">Security Score: {securityScore}%</span>
        </div>
      </div>

      {/* Authentication Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Authentication Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Two-Factor Authentication (2FA)</div>
                <div className="text-sm text-gray-600">
                  {twoFactorEnabled ? "Active on current device" : "Inactive - Enable for extra security"}
                </div>
              </div>
              <Switch 
                checked={twoFactorEnabled} 
                onCheckedChange={handleToggle2FA}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Email Alerts</div>
                <div className="text-sm text-gray-600">
                  Notify when someone signs in or registers with your email
                </div>
              </div>
              <Switch 
                checked={emailAlerts} 
                onCheckedChange={handleEmailAlertsToggle}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">SMS Alerts</div>
                <div className="text-sm text-gray-600">
                  Send message to registered phone for account sign-ups
                </div>
              </div>
              <Switch 
                checked={smsAlerts} 
                onCheckedChange={handleSMSAlertsToggle}
              />
            </div>

            <Button className="w-full mt-4" onClick={() => toast({
              title: "Settings Updated",
              description: "Your security settings have been saved successfully.",
            })}>
              Update Security Settings
            </Button>
          </CardContent>
        </Card>

        {/* Device Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Device Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              {loginHistory.map((login) => (
                <div key={login.id} className={`flex items-center justify-between p-3 rounded-lg ${
                  login.status === "current" ? "bg-green-50 ring-2 ring-green-200" : "bg-gray-50"
                }`}>
                  <div className="flex items-center gap-3">
                    {login.device.includes("iPhone") || login.device.includes("Android") ? (
                      <Smartphone className="h-4 w-4 text-gray-600" />
                    ) : (
                      <Monitor className="h-4 w-4 text-gray-600" />
                    )}
                    <div>
                      <div className="font-medium text-sm flex items-center gap-2">
                        {login.device}
                        {login.status === "current" && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Current Activity
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-600 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {login.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {login.time}
                    </div>
                    {login.status === "current" && (
                      <CheckCircle className="h-4 w-4 text-green-500 ml-auto mt-1" />
                    )}
                    {login.status === "suspicious" && (
                      <AlertTriangle className="h-4 w-4 text-red-500 ml-auto mt-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={handleActivateCurrentDevice}
              >
                <Shield className="h-4 w-4 mr-2" />
                Trust This Device
              </Button>
              <Button 
                variant="outline" 
                onClick={handleClearLoginHistory}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear History
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Recommendations - Automatically Activated */}
      <Card>
        <CardHeader>
          <CardTitle>Security Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {!twoFactorEnabled && (
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <div className="font-medium text-red-800">Enable Two-Factor Authentication</div>
                  <div className="text-sm text-red-700">Critical: Your account needs 2FA for enhanced security</div>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleToggle2FA(true)} className="ml-auto">
                  Enable Now
                </Button>
              </div>
            )}
            
            {!smsAlerts && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <div className="font-medium text-yellow-800">Enable SMS Alerts</div>
                  <div className="text-sm text-yellow-700">Recommended: Get notified of suspicious account activity</div>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleSMSAlertsToggle(true)} className="ml-auto">
                  Enable
                </Button>
              </div>
            )}
            
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-blue-800">Password Security</div>
                <div className="text-sm text-blue-700">Your password meets security requirements</div>
              </div>
              <Button size="sm" variant="outline" className="ml-auto">
                Change Password
              </Button>
            </div>

            {loginHistory.some(login => login.status === "suspicious") && (
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <div className="font-medium text-red-800">Suspicious Activity Detected</div>
                  <div className="text-sm text-red-700">Recent login from unfamiliar location detected</div>
                </div>
                <Button size="sm" variant="outline" className="ml-auto">
                  Review Activity
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityPanel;
