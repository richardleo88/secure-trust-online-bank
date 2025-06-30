import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Clock, MapPin, Monitor, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ActivityLog {
  id: string;
  action: string;
  device_info: any;
  location_info: any;
  created_at: string;
  success: boolean;
  ip_address: unknown;
}

interface UserSession {
  id: string;
  user_id: string;
  device_name: string;
  device_type: string;
  browser: string;
  os: string;
  ip_address: unknown;
  location: any;
  is_active: boolean;
  last_activity: string;
  created_at: string;
}

const SecurityAuditPanel = () => {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [userSessions, setUserSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logActivity } = useAuth();
  const { toast } = useToast();

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

  const getDeviceName = () => {
    const userAgent = navigator.userAgent;
    
    // Detect device type and OS
    let deviceType = 'Desktop';
    let os = 'Unknown';
    
    if (/Android/i.test(userAgent)) {
      deviceType = 'Mobile';
      os = 'Android';
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      deviceType = /iPad/i.test(userAgent) ? 'Tablet' : 'Mobile';
      os = 'iOS';
    } else if (/Windows/i.test(userAgent)) {
      os = 'Windows';
    } else if (/Mac/i.test(userAgent)) {
      os = 'macOS';
    } else if (/Linux/i.test(userAgent)) {
      os = 'Linux';
    }

    // Detect browser
    let browser = 'Unknown';
    if (/Chrome/i.test(userAgent) && !/Edge/i.test(userAgent)) {
      browser = 'Chrome';
    } else if (/Firefox/i.test(userAgent)) {
      browser = 'Firefox';
    } else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
      browser = 'Safari';
    } else if (/Edge/i.test(userAgent)) {
      browser = 'Edge';
    }

    return `${os} - ${browser}`;
  };

  const createCurrentSession = async () => {
    if (!user) return;

    try {
      // Create dummy session data
      const dummySession: UserSession = {
        id: `session-${Date.now()}`,
        user_id: user.id,
        device_name: getDeviceName(),
        device_type: /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        browser: navigator.userAgent.match(/(Chrome|Firefox|Safari|Edge)/)?.[0] || 'Unknown',
        os: navigator.platform,
        ip_address: '192.168.1.1',
        location: {
          city: 'New York',
          region: 'NY',
          country: 'United States',
          country_code: 'US',
          timezone: 'America/New_York'
        },
        is_active: true,
        last_activity: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      setUserSessions([dummySession]);
    } catch (error) {
      console.error('Error creating current session:', error);
    }
  };

  const fetchSecurityData = async () => {
    if (!user) return;

    try {
      // Create dummy activity logs
      const dummyLogs: ActivityLog[] = [
        {
          id: '1',
          action: 'login',
          device_info: {},
          location_info: {
            city: 'New York',
            country: 'United States',
            country_code: 'US'
          },
          created_at: new Date().toISOString(),
          success: true,
          ip_address: '192.168.1.1'
        }
      ];

      setActivityLogs(dummyLogs);

      // Create current session if none exists
      if (userSessions.length === 0) {
        await createCurrentSession();
      }

    } catch (error) {
      console.error('Error fetching security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const terminateSession = async (sessionId: string) => {
    try {
      // Remove session from state
      setUserSessions(prev => prev.filter(s => s.id !== sessionId));

      await logActivity('session_terminated', 'session', sessionId);
      
      toast({
        title: "Session Terminated",
        description: "The selected session has been terminated successfully.",
      });

      fetchSecurityData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to terminate session",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSecurityData();
  }, [user]);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'login': return 'bg-green-100 text-green-800';
      case 'logout': return 'bg-gray-100 text-gray-800';
      case 'login_failed': return 'bg-red-100 text-red-800';
      case 'transaction_create': return 'bg-blue-100 text-blue-800';
      case 'profile_update': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'desktop': return <Monitor className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const formatIpAddress = (ip: unknown): string => {
    return typeof ip === 'string' ? ip : String(ip) || 'Unknown';
  };

  const getLocationString = (location: any): string => {
    if (location && typeof location === 'object' && location !== null) {
      const loc = location as Record<string, any>;
      const flag = getCountryFlag(loc.country_code);
      return `${flag} ${loc.city || 'Unknown'}, ${loc.country || 'Unknown'}`;
    }
    return '🌍 Unknown';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-banking-navy">Security & Audit</h2>
        <Button variant="outline" onClick={fetchSecurityData}>
          <Shield className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activityLogs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent activity since account creation</p>
            ) : (
              activityLogs.map((log) => (
                <div key={log.id} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getActionColor(log.action)}>
                        {log.action.replace('_', ' ').toUpperCase()}
                      </Badge>
                      {!log.success && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(log.created_at).toLocaleString()}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {getLocationString(log.location_info)}
                      <span className="mx-2">•</span>
                      IP: {formatIpAddress(log.ip_address)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Active Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {userSessions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No active sessions</p>
            ) : (
              userSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="text-gray-400">
                      {getDeviceIcon(session.device_type)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {session.device_name || `${session.os} - ${session.browser}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getLocationString(session.location)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Last active: {new Date(session.last_activity).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        IP: {formatIpAddress(session.ip_address)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => terminateSession(session.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Terminate
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Enable Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600 mb-3">
                Add an extra layer of security to your account with 2FA.
              </p>
              <Button size="sm" variant="outline">
                Enable 2FA
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Regular Password Updates</h4>
              <p className="text-sm text-gray-600 mb-3">
                Change your password regularly to maintain account security.
              </p>
              <Button size="sm" variant="outline">
                Change Password
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Monitor Login Locations</h4>
              <p className="text-sm text-gray-600 mb-3">
                Review login locations and report suspicious activity.
              </p>
              <Button size="sm" variant="outline">
                View All Logins
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Account Alerts</h4>
              <p className="text-sm text-gray-600 mb-3">
                Set up alerts for account activities and transactions.
              </p>
              <Button size="sm" variant="outline">
                Manage Alerts
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityAuditPanel;
