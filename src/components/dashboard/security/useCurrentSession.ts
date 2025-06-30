
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
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
      const { deviceName } = getCurrentDeviceInfo();

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
        await fetchCurrentSession();
      }
    } catch (error) {
      console.error('Error creating current session:', error);
    }
  };

  useEffect(() => {
    fetchCurrentSession();
  }, [user]);

  return { currentSession, loading, refetchSession: fetchCurrentSession };
};
