import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Shield, Smartphone, Monitor, AlertTriangle, CheckCircle, Trash2, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface UserSession {
  id: string;
  device_name: string;
  device_type: string;
  browser: string;
  os: string;
  ip_address: string;
  location: {
    city: string;
    region: string;
    country: string;
    country_code: string;
    timezone: string;
  };
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
  const [userSessions, setUserSessions] = useState<UserSession[]>([]);
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

  const fetchUserSessions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data: sessions, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('last_activity', { ascending: false });

      if (error) {
        console.error('Error fetching sessions:', error);
        return;
      }

      // If no sessions exist, create current session
      if (!sessions || sessions.length === 0) {
        await createCurrentSession();
        return;
      }

      setUserSessions(sessions || []);
    } catch (error) {
      console.error('Error in fetchUserSessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCurrentSession = async () => {
    if (!user) return;

    try {
      // Get current device info
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
        // Refetch sessions after creating
        await fetchUserSessions();
      }
    } catch (error) {
      console.error('Error creating current session:', error);
    }
  };

  const terminateSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({ is_active: false })
        .eq('id', sessionId)
        .eq('user_id', user?.id);

      if (error) throw error;

      await logActivity('session_terminated', 'session', sessionId);
      
      toast({
        title: "Session Terminated",
        description: "The selected session has been terminated successfully.",
      });

      fetchUserSessions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to terminate session",
        variant: "destructive",
      });
    }
  };

  const isCurrentSession = (session: UserSession) => {
    const currentDevice = getCurrentDeviceInfo();
    return session.device_name === currentDevice.deviceName;
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
    fetchUserSessions();
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

        {/* Device Management - All Active Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Device Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading sessions...</div>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {userSessions.map((session) => (
                    <div 
                      key={session.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        isCurrentSession(session) 
                          ? 'bg-green-50 ring-2 ring-green-200' 
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {getDeviceIcon(session.device_type)}
                        <div>
                          <div className="font-medium text-sm flex items-center gap-2">
                            {session.device_name}
                            {isCurrentSession(session) && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                Current Device
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {getCountryFlag(session.location?.country_code)} {session.location?.city}, {session.location?.country}
                          </div>
                          <div className="text-xs text-gray-500">
                            {session.browser} • {session.os}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(session.last_activity).toLocaleDateString()}
                        </div>
                        {isCurrentSession(session) ? (
                          <CheckCircle className="h-4 w-4 text-green-500 ml-auto mt-1" />
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => terminateSession(session.id)}
                            className="text-red-600 hover:text-red-700 mt-1"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
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
                </div>
              </>
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
