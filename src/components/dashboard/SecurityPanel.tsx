
import { useState } from "react";
import { Shield } from "lucide-react";
import AuthenticationSettings from "./security/AuthenticationSettings";
import CurrentDevice from "./security/CurrentDevice";
import SecurityRecommendations from "./security/SecurityRecommendations";
import { useCurrentSession } from "./security/useCurrentSession";
import { SecuritySettings } from "./security/types";

const SecurityPanel = () => {
  const { currentSession, loading } = useCurrentSession();
  const [settings, setSettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    emailAlerts: true,
    smsAlerts: false,
  });

  const handleSettingsChange = (newSettings: Partial<SecuritySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const securityScore = 75;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-banking-navy">Security Center</h2>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-500" />
          <span className="font-semibold text-green-600">Security Score: {securityScore}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AuthenticationSettings 
          settings={settings} 
          onSettingsChange={handleSettingsChange} 
        />
        <CurrentDevice session={currentSession} loading={loading} />
      </div>

      <SecurityRecommendations 
        settings={settings} 
        onSettingsChange={handleSettingsChange} 
      />
    </div>
  );
};

export default SecurityPanel;
