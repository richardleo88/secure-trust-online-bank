
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SecuritySettings } from "./types";

interface AuthenticationSettingsProps {
  settings: SecuritySettings;
  onSettingsChange: (settings: Partial<SecuritySettings>) => void;
}

const AuthenticationSettings = ({ settings, onSettingsChange }: AuthenticationSettingsProps) => {
  const { toast } = useToast();

  const handleToggle2FA = (enabled: boolean) => {
    onSettingsChange({ twoFactorEnabled: enabled });
    toast({
      title: enabled ? "2FA Enabled" : "2FA Disabled",
      description: enabled 
        ? "Two-factor authentication has been activated for enhanced security."
        : "Two-factor authentication has been disabled.",
    });
  };

  const handleEmailAlertsToggle = (enabled: boolean) => {
    onSettingsChange({ emailAlerts: enabled });
    toast({
      title: enabled ? "Email Alerts Enabled" : "Email Alerts Disabled",
      description: enabled 
        ? "You will receive email notifications for account sign-ins and new registrations."
        : "Email notifications have been disabled.",
    });
  };

  const handleSMSAlertsToggle = (enabled: boolean) => {
    onSettingsChange({ smsAlerts: enabled });
    toast({
      title: enabled ? "SMS Alerts Enabled" : "SMS Alerts Disabled",
      description: enabled 
        ? "You will receive SMS notifications for account sign-ups."
        : "SMS notifications have been disabled.",
    });
  };

  return (
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
              {settings.twoFactorEnabled ? "Active on current device" : "Inactive - Enable for extra security"}
            </div>
          </div>
          <Switch 
            checked={settings.twoFactorEnabled} 
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
            checked={settings.emailAlerts} 
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
            checked={settings.smsAlerts} 
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
  );
};

export default AuthenticationSettings;
