
export interface UserSession {
  id: string;
  user_id: string; // Add missing user_id property
  session_token: string;
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
  expires_at: string | null;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  emailAlerts: boolean;
  smsAlerts: boolean;
}
