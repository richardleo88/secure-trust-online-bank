
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Shield, Smartphone, Monitor, AlertTriangle, CheckCircle } from "lucide-react";

const SecurityPanel = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  const recentLogins = [
    { device: "iPhone 14", location: "New York, NY", time: "2 hours ago", status: "current" },
    { device: "Chrome Browser", location: "New York, NY", time: "1 day ago", status: "success" },
    { device: "Safari Browser", location: "Boston, MA", time: "3 days ago", status: "suspicious" },
  ];

  const securityScore = 85;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-banking-navy">Security Center</h2>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-500" />
          <span className="font-semibold text-green-600">Security Score: {securityScore}%</span>
        </div>
      </div>

      {/* Security Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Authentication Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Two-Factor Authentication</div>
                <div className="text-sm text-gray-600">Add extra security to your account</div>
              </div>
              <Switch 
                checked={twoFactorEnabled} 
                onCheckedChange={setTwoFactorEnabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Email Alerts</div>
                <div className="text-sm text-gray-600">Get notified of account activity</div>
              </div>
              <Switch 
                checked={emailAlerts} 
                onCheckedChange={setEmailAlerts}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">SMS Alerts</div>
                <div className="text-sm text-gray-600">Receive text notifications</div>
              </div>
              <Switch 
                checked={smsAlerts} 
                onCheckedChange={setSmsAlerts}
              />
            </div>

            <Button className="w-full mt-4">
              Update Security Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Device Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLogins.map((login, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    {login.device.includes("iPhone") ? (
                      <Smartphone className="h-4 w-4 text-gray-600" />
                    ) : (
                      <Monitor className="h-4 w-4 text-gray-600" />
                    )}
                    <div>
                      <div className="font-medium text-sm">{login.device}</div>
                      <div className="text-xs text-gray-600">{login.location}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">{login.time}</div>
                    {login.status === "current" && (
                      <CheckCircle className="h-4 w-4 text-green-500 ml-auto mt-1" />
                    )}
                    {login.status === "suspicious" && (
                      <AlertTriangle className="h-4 w-4 text-red-500 ml-auto mt-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Manage All Devices
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Security Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <div className="font-medium text-yellow-800">Enable SMS Alerts</div>
                <div className="text-sm text-yellow-700">Add SMS notifications for enhanced security monitoring</div>
              </div>
              <Button size="sm" variant="outline" className="ml-auto">
                Enable
              </Button>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-blue-800">Update Password</div>
                <div className="text-sm text-blue-700">Your password was last updated 6 months ago</div>
              </div>
              <Button size="sm" variant="outline" className="ml-auto">
                Update
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityPanel;
