
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Smartphone, Monitor, CheckCircle, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserSession } from "./types";
import { getCountryFlag } from "./utils";

interface CurrentDeviceProps {
  session: UserSession | null;
  loading: boolean;
}

const CurrentDevice = ({ session, loading }: CurrentDeviceProps) => {
  const { toast } = useToast();

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Current Device
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading device info...</div>
        ) : session ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 ring-2 ring-green-200">
              <div className="flex items-center gap-3">
                {getDeviceIcon(session.device_type)}
                <div>
                  <div className="font-medium text-sm flex items-center gap-2">
                    {session.device_name}
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Current Device
                    </span>
                  </div>
                  {session.location && (
                    <div className="text-xs text-gray-600 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {getCountryFlag(session.location.country_code)} {session.location.city}, {session.location.country}
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    {session.browser} • {session.os}
                  </div>
                  {session.ip_address && (
                    <div className="text-xs text-gray-500">
                      IP: {session.ip_address}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(session.last_activity).toLocaleDateString()}
                </div>
                <CheckCircle className="h-4 w-4 text-green-500 ml-auto mt-1" />
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => toast({
                title: "Device Already Trusted",
                description: "Current device is already set as trusted.",
              })}
            >
              <Shield className="h-4 w-4 mr-2" />
              Trust This Device
            </Button>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No current session found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrentDevice;
