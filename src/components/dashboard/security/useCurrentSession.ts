
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { UserSession } from "./types";
import { getCurrentDeviceInfo } from "./utils";

export const useCurrentSession = () => {
  const { user } = useAuth();
  const [currentSession, setCurrentSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentSession = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { deviceName, deviceType } = getCurrentDeviceInfo();

      // Create dummy session data
      const dummySession: UserSession = {
        id: `session-${Date.now()}`,
        user_id: user.id,
        session_token: `dummy-token-${Date.now()}`,
        device_name: deviceName,
        device_type: deviceType,
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
        created_at: new Date().toISOString(),
        last_activity: new Date().toISOString(),
        expires_at: null
      };

      setCurrentSession(dummySession);
    } catch (error) {
      console.error('Error in fetchCurrentSession:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentSession();
  }, [user]);

  return { currentSession, loading, refetchSession: fetchCurrentSession };
};
