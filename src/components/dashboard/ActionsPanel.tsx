
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Calendar, UserPlus, CreditCard, Banknote, FileText } from "lucide-react";

const ActionsPanel = () => {
  const quickActions = [
    {
      title: "Transfer Funds",
      description: "Send money between accounts or to others",
      icon: Send,
      color: "bg-blue-500",
    },
    {
      title: "Schedule Payments",
      description: "Set up recurring bill payments",
      icon: Calendar,
      color: "bg-green-500",
    },
    {
      title: "Add Beneficiaries",
      description: "Add new recipients for transfers",
      icon: UserPlus,
      color: "bg-purple-500",
    },
    {
      title: "Apply for Cards",
      description: "Request new credit or debit cards",
      icon: CreditCard,
      color: "bg-orange-500",
    },
    {
      title: "Apply for Loans",
      description: "Personal, auto, or home loans",
      icon: Banknote,
      color: "bg-red-500",
    },
    {
      title: "Statements",
      description: "Download account statements",
      icon: FileText,
      color: "bg-gray-500",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-banking-navy">Quick Actions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-banking-slate text-sm mb-4">{action.description}</p>
              <Button className="w-full" variant="outline">
                Get Started
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="font-medium">Transfer Completed</div>
                <div className="text-sm text-gray-600">$500 to John Savings</div>
              </div>
              <div className="text-sm text-gray-500">2 hours ago</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <div className="font-medium">Bill Payment Scheduled</div>
                <div className="text-sm text-gray-600">Electric Bill - $125</div>
              </div>
              <div className="text-sm text-gray-500">1 day ago</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <div className="font-medium">New Beneficiary Added</div>
                <div className="text-sm text-gray-600">Sarah Johnson</div>
              </div>
              <div className="text-sm text-gray-500">3 days ago</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActionsPanel;
