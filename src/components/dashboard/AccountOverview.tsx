
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, TrendingUp, TrendingDown, Plus, CreditCard, PiggyBank, Wallet } from "lucide-react";

const AccountOverview = () => {
  const [balancesVisible, setBalancesVisible] = useState(true);

  const accounts = [
    { 
      type: "Savings", 
      balance: 15420.50, 
      change: +245.30, 
      trend: "up",
      icon: PiggyBank,
      gradient: "from-blue-600 to-blue-800",
      bgGradient: "from-blue-50 to-blue-100"
    },
    { 
      type: "Checking", 
      balance: 3200.75, 
      change: -120.00, 
      trend: "down",
      icon: Wallet,
      gradient: "from-indigo-600 to-indigo-800",
      bgGradient: "from-indigo-50 to-indigo-100"
    },
    { 
      type: "Credit Card", 
      balance: -850.25, 
      change: -45.50, 
      trend: "down",
      icon: CreditCard,
      gradient: "from-slate-600 to-slate-800",
      bgGradient: "from-slate-50 to-slate-100"
    },
  ];

  const recentTransactions = [
    { type: "Deposit", amount: 2500, date: "2024-01-15", description: "Salary Deposit", category: "Income" },
    { type: "Transfer", amount: -150, date: "2024-01-14", description: "To Savings Account", category: "Transfer" },
    { type: "Purchase", amount: -45.50, date: "2024-01-13", description: "Grocery Store", category: "Shopping" },
    { type: "Transfer", amount: -800, date: "2024-01-12", description: "Rent Payment", category: "Bills" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Account Overview
          </h2>
          <p className="text-slate-600 mt-1">Manage your finances with confidence</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setBalancesVisible(!balancesVisible)}
          className="border-blue-200 hover:bg-blue-50 hover:border-blue-300"
        >
          {balancesVisible ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
          {balancesVisible ? "Hide" : "Show"} Balances
        </Button>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {accounts.map((account, index) => {
          const IconComponent = account.icon;
          return (
            <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className={`absolute inset-0 bg-gradient-to-br ${account.bgGradient} opacity-50`} />
              <div className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${account.gradient} flex items-center justify-center`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-slate-700">
                        {account.type}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-3xl font-bold text-slate-800">
                      {balancesVisible ? `$${Math.abs(account.balance).toLocaleString()}` : "••••••"}
                      {account.balance < 0 && balancesVisible && (
                        <span className="text-red-500 text-lg ml-2">CR</span>
                      )}
                    </div>
                    {balancesVisible && (
                      <div className="flex items-center text-sm">
                        {account.trend === "up" ? (
                          <div className="flex items-center text-emerald-600">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            <span>+${Math.abs(account.change).toFixed(2)}</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-red-500">
                            <TrendingDown className="h-4 w-4 mr-1" />
                            <span>-${Math.abs(account.change).toFixed(2)}</span>
                          </div>
                        )}
                        <span className="text-slate-500 ml-2">this month</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Transactions */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Recent Transactions</CardTitle>
              <p className="text-blue-100 text-sm mt-1">Your latest account activity</p>
            </div>
            <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
              <Plus className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.amount > 0 
                          ? 'bg-emerald-100 text-emerald-600' 
                          : 'bg-slate-100 text-slate-600'
                        }`}>
                        {transaction.amount > 0 ? '+' : '-'}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{transaction.description}</div>
                        <div className="flex items-center space-x-2 text-sm text-slate-500">
                          <span>{transaction.date}</span>
                          <span>•</span>
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                            {transaction.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-lg ${
                      transaction.amount > 0 ? "text-emerald-600" : "text-slate-700"
                    }`}>
                      {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-500 capitalize">{transaction.type}</div>
                  </div>
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
