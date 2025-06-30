
export interface UserSession {
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

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  emailAlerts: boolean;
  smsAlerts: boolean;
}
