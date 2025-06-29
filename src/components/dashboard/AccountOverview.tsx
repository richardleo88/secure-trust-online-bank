
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, TrendingUp, TrendingDown, Plus, CreditCard, PiggyBank, Wallet } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useTransactions } from "@/hooks/useTransactions";

const AccountOverview = () => {
  const [balancesVisible, setBalancesVisible] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const { user } = useAuth();
  const { transactions } = useTransactions();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setUserProfile(data);
      }
    };

    fetchUserProfile();
  }, [user]);

  const accounts = [
    { 
      type: "Checking", 
      balance: userProfile?.balance || 0, 
      change: 0, 
      trend: "neutral",
      icon: Wallet,
      gradient: "from-blue-600 to-blue-800",
      bgGradient: "from-blue-50 to-blue-100"
    },
    { 
      type: "Savings", 
      balance: 0, 
      change: 0, 
      trend: "neutral",
      icon: PiggyBank,
      gradient: "from-indigo-600 to-indigo-800",
      bgGradient: "from-indigo-50 to-indigo-100"
    },
    { 
      type: "Credit Card", 
      balance: 0, 
      change: 0, 
      trend: "neutral",
      icon: CreditCard,
      gradient: "from-slate-600 to-slate-800",
      bgGradient: "from-slate-50 to-slate-100"
    },
  ];

  // Get recent transactions from the database
  const recentTransactions = transactions.slice(0, 4).map(transaction => ({
    type: transaction.transaction_type,
    amount: -transaction.amount, // Outgoing transactions are negative
    date: new Date(transaction.created_at).toLocaleDateString(),
    description: `To ${transaction.recipient_name}`,
    category: transaction.transaction_type.replace('_', ' '),
    status: transaction.status
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Real Account Overview
          </h2>
          <p className="text-slate-600 mt-1">Your live banking account with immediate processing</p>
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
                        {account.type} {index === 0 && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full ml-2">ACTIVE</span>}
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
                    {balancesVisible && index === 0 && (
                      <div className="text-sm text-green-600 font-medium">
                        Real-time balance • Updates immediately
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
              <p className="text-blue-100 text-sm mt-1">Live transaction history - All transfers processed immediately</p>
            </div>
            <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
              <Plus className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {recentTransactions.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <p>No transactions yet</p>
              <p className="text-sm mt-1">Start making transfers to see your activity here</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentTransactions.map((transaction, index) => (
                <div key={index} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.amount > 0 
                            ? 'bg-emerald-100 text-emerald-600' 
                            : 'bg-red-100 text-red-600'
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
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              transaction.status === 'completed' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {transaction.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold text-lg ${
                        transaction.amount > 0 ? "text-emerald-600" : "text-red-600"
                      }`}>
                        {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                      </div>
                      <div className="text-xs text-slate-500 capitalize">{transaction.type}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountOverview;
