
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockDataService } from "@/services/mockDataService";
import { useToast } from "@/hooks/use-toast";
import { Search, Activity, AlertCircle, CheckCircle } from "lucide-react";

interface TransactionLogsProps {
  adminRole: string;
}

interface Transaction {
  id: string;
  user_id: string;
  transaction_type: string;
  amount: number;
  recipient_name: string;
  status: string;
  reference_number: string;
  created_at: string;
  user_email?: string;
  user_name?: string;
}

const TransactionLogs = ({ adminRole }: TransactionLogsProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const fetchTransactions = async () => {
    try {
      // Get all transactions
      const { data: transactionData } = await mockDataService.getAllTransactions();

      // Get all profiles
      const { data: profiles } = await mockDataService.getAllProfiles();

      // Combine the data
      const transactionsWithUserInfo = transactionData.map(transaction => {
        const userProfile = profiles.find(profile => profile.id === transaction.user_id);
        return {
          ...transaction,
          user_email: userProfile?.email,
          user_name: userProfile?.full_name
        };
      });

      setTransactions(transactionsWithUserInfo);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transaction logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(transaction =>
    transaction.reference_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.recipient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
        <h2 className="text-2xl font-bold text-gray-900">Transaction Logs</h2>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          <span className="text-sm text-gray-600">Real-time monitoring</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-sm">
                      {transaction.reference_number}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{transaction.user_name || 'Unknown'}</p>
                        <p className="text-sm text-gray-500">{transaction.user_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {transaction.transaction_type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.recipient_name}</TableCell>
                    <TableCell className="font-medium">
                      ${transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell>
                      {new Date(transaction.created_at).toLocaleString()}
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

export default TransactionLogs;
