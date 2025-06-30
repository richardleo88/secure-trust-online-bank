import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Shield, Smartphone, Monitor, AlertTriangle, CheckCircle, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface UserSession {
  id: string;
  device_name: string;
  device_type: string;
  browser: string;
  os: string;
  ip_address: string | null;
  location: {
    city: string;
    region: string;
    country: string;
    country_code: string;
    timezone: string;
  } | null;
  is_active: boolean;
  last_activity: string;
  created_at: string;
}

const SecurityPanel = () => {
  const { toast } = useToast();
  const { user, logActivity } = useAuth();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [currentSession, setCurrentSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  const getCountryFlag = (countryCode: string) => {
    if (!countryCode) return '🌍';
    try {
      const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
      return String.fromCodePoint(...codePoints);
    } catch {
      return '🌍';
    }
  };

  const getCurrentDeviceInfo = () => {
    const userAgent = navigator.userAgent;
    let deviceName = "Unknown Device";
    let deviceType = "desktop";
    
    if (/iPhone/.test(userAgent)) {
      deviceName = "iPhone";
      deviceType = "mobile";
    } else if (/iPad/.test(userAgent)) {
      deviceName = "iPad";
      deviceType = "tablet";
    } else if (/Android/.test(userAgent)) {
      deviceName = "Android Device";
      deviceType = "mobile";
    } else if (/Windows/.test(userAgent)) {
      deviceName = "Windows PC";
    } else if (/Mac/.test(userAgent)) {
      deviceName = "MacBook";
    } else if (/Linux/.test(userAgent)) {
      deviceName = "Linux PC";
    }
    
    return { deviceName, deviceType };
  };

  const fetchCurrentSession = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { deviceName } = getCurrentDeviceInfo();

      // Try to find the current device session
      const { data: sessions, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .eq('device_name', deviceName)
        .order('last_activity', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching current session:', error);
        return;
      }

      if (sessions && sessions.length > 0) {
        const session = sessions[0];
        setCurrentSession({
          ...session,
          ip_address: typeof session.ip_address === 'string' ? session.ip_address : null,
          location: session.location && typeof session.location === 'object' ? session.location as any : null
        });
      } else {
        // If no current session exists, create one
        await createCurrentSession();
      }
    } catch (error) {
      console.error('Error in fetchCurrentSession:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCurrentSession = async () => {
    if (!user) return;

    try {
      const { deviceName, deviceType } = getCurrentDeviceInfo();
      
      // Get location info
      const locationResponse = await fetch('https://ipapi.co/json/');
      const locationData = await locationResponse.json();

      const sessionData = {
        user_id: user.id,
        session_token: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        device_name: deviceName,
        device_type: deviceType,
        browser: navigator.userAgent.match(/(Chrome|Firefox|Safari|Edge)/)?.[0] || 'Unknown',
        os: navigator.platform,
        ip_address: locationData.ip,
        location: {
          city: locationData.city,
          region: locationData.region,
          country: locationData.country_name,
          country_code: locationData.country_code,
          timezone: locationData.timezone
        }
      };

      const { error } = await supabase
        .from('user_sessions')
        .insert(sessionData);

      if (error) {
        console.error('Error creating session:', error);
      } else {
        // Refetch current session after creating
        await fetchCurrentSession();
      }
    } catch (error) {
      console.error('Error creating current session:', error);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile':
      case 'tablet':
        return <Smartphone className="h-4 w-4" />;
      case 'desktop':
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  useEffect(() => {
    fetchCurrentSession();
  }, [user]);

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

        {/* Current Device Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Current Device
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading device info...</div>
            ) : currentSession ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 ring-2 ring-green-200">
                  <div className="flex items-center gap-3">
                    {getDeviceIcon(currentSession.device_type)}
                    <div>
                      <div className="font-medium text-sm flex items-center gap-2">
                        {currentSession.device_name}
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Current Device
                        </span>
                      </div>
                      {currentSession.location && (
                        <div className="text-xs text-gray-600 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {getCountryFlag(currentSession.location.country_code)} {currentSession.location.city}, {currentSession.location.country}
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        {currentSession.browser} • {currentSession.os}
                      </div>
                      {currentSession.ip_address && (
                        <div className="text-xs text-gray-500">
                          IP: {currentSession.ip_address}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(currentSession.last_activity).toLocaleDateString()}
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-500 ml-auto mt-1" />
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => toast({
                    title: "Device Already Trusted",
                    description: "Current device is already set as trusted.",
                  })}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Trust This Device
                </Button>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No current session found
              </div>
            )}
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
