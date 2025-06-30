
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SecuritySettings } from "./types";

interface SecurityRecommendationsProps {
  settings: SecuritySettings;
  onSettingsChange: (settings: Partial<SecuritySettings>) => void;
}

const SecurityRecommendations = ({ settings, onSettingsChange }: SecurityRecommendationsProps) => {
  const { toast } = useToast();

  const handleEnable2FA = () => {
    onSettingsChange({ twoFactorEnabled: true });
    toast({
      title: "2FA Enabled",
      description: "Two-factor authentication has been activated for enhanced security.",
    });
  };

  const handleEnableSMS = () => {
    onSettingsChange({ smsAlerts: true });
    toast({
      title: "SMS Alerts Enabled",
      description: "You will receive SMS notifications for account sign-ups.",
    });
  };

  const handleChangePassword = () => {
    toast({
      title: "Password Change",
      description: "Password change feature would open here in a real application.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {!settings.twoFactorEnabled && (
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
          
          {!settings.smsAlerts && (
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
  );
};

export default SecurityRecommendations;
