
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Shield, Eye, CheckCircle } from "lucide-react";

interface FraudMonitoringProps {
  adminRole: string;
}

interface FraudAlert {
  id: string;
  user_id: string;
  alert_type: string;
  severity: string;
  description: string;
  status: string;
  created_at: string;
  user_email?: string;
  user_name?: string;
}

const FraudMonitoring = ({ adminRole }: FraudMonitoringProps) => {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchFraudAlerts = async () => {
    try {
      // First get fraud alerts
      const { data: alertData, error: alertError } = await supabase
        .from('fraud_alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (alertError) throw alertError;

      // Then get user profiles
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, full_name');

      if (profileError) throw profileError;

      // Combine the data
      const alertsWithUserInfo = alertData?.map(alert => {
        const userProfile = profiles?.find(profile => profile.id === alert.user_id);
        return {
          ...alert,
          user_email: userProfile?.email,
          user_name: userProfile?.full_name
        };
      }) || [];

      setAlerts(alertsWithUserInfo);
    } catch (error: any) {
      console.error('Error fetching fraud alerts:', error);
      toast({
        title: "Error",
        description: "Failed to load fraud alerts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFraudAlerts();
  }, []);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800">Low</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Active</Badge>;
      case 'investigated':
        return <Badge className="bg-yellow-100 text-yellow-800"><Eye className="h-3 w-3 mr-1" />Investigated</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Resolved</Badge>;
      case 'false_positive':
        return <Badge className="bg-gray-100 text-gray-800">False Positive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const updateAlertStatus = async (alertId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('fraud_alerts')
        .update({ 
          status: newStatus,
          investigated_at: new Date().toISOString()
        })
        .eq('id', alertId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Alert status updated successfully",
      });

      fetchFraudAlerts();
    } catch (error: any) {
      console.error('Error updating alert status:', error);
      toast({
        title: "Error",
        description: "Failed to update alert status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Fraud Monitoring</h2>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <span className="text-sm text-gray-600">Real-time detection</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-red-600">
                  {alerts.filter(a => a.status === 'active').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Under Investigation</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {alerts.filter(a => a.status === 'investigated').length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">
                  {alerts.filter(a => a.status === 'resolved').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-600">
                  {alerts.filter(a => a.severity === 'critical').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fraud Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Alert Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{alert.user_name || 'Unknown'}</p>
                        <p className="text-sm text-gray-500">{alert.user_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {alert.alert_type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {alert.description}
                    </TableCell>
                    <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                    <TableCell>{getStatusBadge(alert.status)}</TableCell>
                    <TableCell>
                      {new Date(alert.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {alert.status === 'active' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateAlertStatus(alert.id, 'investigated')}
                          >
                            Investigate
                          </Button>
                        )}
                        {alert.status === 'investigated' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateAlertStatus(alert.id, 'resolved')}
                          >
                            Resolve
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FraudMonitoring;
