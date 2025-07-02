
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDataService } from "@/services/mockDataService";
import { useToast } from "@/hooks/use-toast";
import { Users, Activity, DollarSign, AlertTriangle } from "lucide-react";

const Analytics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    totalAmount: 0,
    activeAlerts: 0,
    newUsersToday: 0,
    transactionsToday: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAnalytics = async () => {
    try {
      // Get all profiles
      const { data: profiles } = await mockDataService.getAllProfiles();
      const totalUsers = profiles.length;

      // Get all transactions
      const { data: transactions } = await mockDataService.getAllTransactions();
      const totalTransactions = transactions.length;

      // Calculate total transaction amount
      const totalAmount = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

      // Mock active alerts
      const activeAlerts = 2;

      // Get new users today (mock)
      const newUsersToday = 1;

      // Get transactions today (mock)
      const transactionsToday = 3;

      setStats({
        totalUsers,
        totalTransactions,
        totalAmount,
        activeAlerts,
        newUsersToday,
        transactionsToday
      });
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                <p className="text-xs text-green-600 mt-1">+{stats.newUsersToday} today</p>
              </div>
              <Users className="h-12 w-12 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalTransactions}</p>
                <p className="text-xs text-green-600 mt-1">+{stats.transactionsToday} today</p>
              </div>
              <Activity className="h-12 w-12 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Transaction Volume</p>
                <p className="text-3xl font-bold text-purple-600">
                  ${stats.totalAmount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total processed</p>
              </div>
              <DollarSign className="h-12 w-12 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Alerts</p>
                <p className="text-3xl font-bold text-red-600">{stats.activeAlerts}</p>
                <p className="text-xs text-red-600 mt-1">Requires attention</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-red-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">New user registration</p>
                  <p className="text-sm text-gray-600">2 minutes ago</p>
                </div>
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">Wire transfer completed</p>
                  <p className="text-sm text-gray-600">5 minutes ago</p>
                </div>
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium">Fraud alert triggered</p>
                  <p className="text-sm text-gray-600">10 minutes ago</p>
                </div>
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database Status</span>
                <span className="text-green-600 font-medium">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API Response Time</span>
                <span className="text-green-600 font-medium">124ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Sessions</span>
                <span className="text-blue-600 font-medium">{stats.totalUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">System Uptime</span>
                <span className="text-green-600 font-medium">99.9%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
