
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

  // Get user's approximate location (mock for demo)
  const getCurrentLocation = () => {
    return "New York, NY"; // In real app, this would come from IP geolocation
  };

  const [currentSession] = useState({
    id: 1,
    device: getCurrentDevice(),
    location: getCurrentLocation(),
    time: "Current session",
    status: "current",
    trusted: true
  });

  const securityScore = 75;

  const handleActivateCurrentDevice = () => {
    toast({
      title: "Device Already Trusted",
      description: "Current device is already set as trusted.",
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

  const handleChangePassword = () => {
    toast({
      title: "Password Change",
      description: "Password change feature would open here in a real application.",
    });
  };

  const handleEnable2FA = () => {
    handleToggle2FA(true);
  };

  const handleEnableSMS = () => {
    handleSMSAlertsToggle(true);
  };

  const handleReviewActivity = () => {
    toast({
      title: "Security Review",
      description: "Security activity review would open here in a real application.",
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

        {/* Device Management - Current Session Only */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Device Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 ring-2 ring-green-200">
                <div className="flex items-center gap-3">
                  {currentSession.device.includes("iPhone") || currentSession.device.includes("Android") ? (
                    <Smartphone className="h-4 w-4 text-gray-600" />
                  ) : (
                    <Monitor className="h-4 w-4 text-gray-600" />
                  )}
                  <div>
                    <div className="font-medium text-sm flex items-center gap-2">
                      {currentSession.device}
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Current Activity
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {currentSession.location}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {currentSession.time}
                  </div>
                  <CheckCircle className="h-4 w-4 text-green-500 ml-auto mt-1" />
                </div>
              </div>
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
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Recommendations - Functional */}
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
                <Button size="sm" variant="outline" onClick={handleEnable2FA} className="ml-auto">
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
                <Button size="sm" variant="outline" onClick={handleEnableSMS} className="ml-auto">
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
              <Button size="sm" variant="outline" onClick={handleChangePassword} className="ml-auto">
                Change Password
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityPanel;
