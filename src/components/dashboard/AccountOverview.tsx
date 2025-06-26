
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, TrendingUp, TrendingDown, Plus } from "lucide-react";

const AccountOverview = () => {
  const [balancesVisible, setBalancesVisible] = useState(true);

  const accounts = [
    { type: "Savings", balance: 15420.50, change: +245.30, trend: "up" },
    { type: "Checking", balance: 3200.75, change: -120.00, trend: "down" },
    { type: "Credit Card", balance: -850.25, change: -45.50, trend: "down" },
  ];

  const recentTransactions = [
    { type: "Deposit", amount: 2500, date: "2024-01-15", description: "Salary Deposit" },
    { type: "Transfer", amount: -150, date: "2024-01-14", description: "To Savings Account" },
    { type: "Purchase", amount: -45.50, date: "2024-01-13", description: "Grocery Store" },
    { type: "Transfer", amount: -800, date: "2024-01-12", description: "Rent Payment" },
  ];

  return (
    <div className="space-y-6">
      {/* Account Balances */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-banking-navy">Account Overview</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setBalancesVisible(!balancesVisible)}
        >
          {balancesVisible ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
          {balancesVisible ? "Hide" : "Show"} Balances
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {accounts.map((account, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-banking-slate">
                {account.type}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-banking-navy">
                  {balancesVisible ? `$${Math.abs(account.balance).toLocaleString()}` : "••••••"}
                  {account.balance < 0 && balancesVisible && (
                    <span className="text-red-500 text-sm ml-1">CR</span>
                  )}
                </div>
                {balancesVisible && (
                  <div className="flex items-center text-sm">
                    {account.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={account.trend === "up" ? "text-green-500" : "text-red-500"}>
                      {account.trend === "up" ? "+" : ""}${Math.abs(account.change).toFixed(2)}
                    </span>
                    <span className="text-banking-slate ml-1">this month</span>
                  </div>
                )}
              </div>
            </CardContent>
            <div className={`absolute bottom-0 left-0 right-0 h-1 ${
              account.type === "Savings" ? "bg-green-500" :
              account.type === "Checking" ? "bg-blue-500" : "bg-red-500"
            }`} />
          </Card>
        ))}
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex-1">
                  <div className="font-medium text-banking-navy">{transaction.description}</div>
                  <div className="text-sm text-banking-slate">{transaction.date}</div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${
                    transaction.amount > 0 ? "text-green-600" : "text-red-600"
                  }`}>
                    {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                  </div>
                  <div className="text-xs text-banking-slate capitalize">{transaction.type}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountOverview;
