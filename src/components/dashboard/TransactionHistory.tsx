
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Download, Eye, Filter, Search, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";

const TransactionHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const transactions = [
    {
      id: "TXN001",
      type: "Wire Transfer",
      recipient: "John Smith",
      amount: "$2,500.00",
      status: "Completed",
      date: "2024-01-15",
      time: "2:30 PM",
      reference: "INT-WIRE-001",
      method: "International Wire",
      account: "****1234"
    },
    {
      id: "TXN002", 
      type: "ACH Transfer",
      recipient: "Sarah Johnson",
      amount: "$1,200.00",
      status: "Completed",
      date: "2024-01-14",
      time: "10:15 AM",
      reference: "ACH-DOM-002",
      method: "Domestic ACH",
      account: "****5678"
    },
    {
      id: "TXN003",
      type: "Local Transfer",
      recipient: "Michael Brown",
      amount: "$350.00",
      status: "Completed",
      date: "2024-01-13",
      time: "4:45 PM",
      reference: "LOCAL-003",
      method: "Zelle",
      account: "****9012"
    },
    {
      id: "TXN004",
      type: "Western Union",
      recipient: "Maria Garcia",
      amount: "$800.00",
      status: "Pending",
      date: "2024-01-12",
      time: "1:20 PM",
      reference: "WU-004",
      method: "Cash Pickup",
      account: "****3456"
    },
    {
      id: "TXN005",
      type: "Wire Transfer",
      recipient: "David Wilson",
      amount: "$5,000.00",
      status: "Failed",
      date: "2024-01-11",
      time: "9:30 AM",
      reference: "INT-WIRE-005",
      method: "International Wire",
      account: "****7890"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || transaction.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-banking-navy">Transaction History</h2>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Statement
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={filterStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("all")}
              >
                All
              </Button>
              <Button 
                variant={filterStatus === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("completed")}
              >
                Completed
              </Button>
              <Button 
                variant={filterStatus === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("pending")}
              >
                Pending
              </Button>
              <Button 
                variant={filterStatus === "failed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("failed")}
              >
                Failed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction List */}
      <div className="space-y-4">
        {filteredTransactions.map((transaction) => (
          <Card key={transaction.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <History className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-banking-navy">{transaction.type}</h3>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm">To: {transaction.recipient}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {transaction.date} at {transaction.time} • {transaction.reference}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Method: {transaction.method} • Account: {transaction.account}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-banking-navy mb-2">
                    {transaction.amount}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {transaction.status === "Completed" && (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Receipt
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-600">
              {searchTerm ? "Try adjusting your search criteria." : "You haven't made any transactions yet."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TransactionHistory;
