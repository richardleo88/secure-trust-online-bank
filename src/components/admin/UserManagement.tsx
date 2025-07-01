import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { Search, UserPlus, Edit, Trash2, Shield, CheckCircle, XCircle, DollarSign, CreditCard, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CreateUserDialog from "./CreateUserDialog";

interface UserManagementProps {
  adminRole: string;
}

const UserManagement = ({ adminRole }: UserManagementProps) => {
  const {
    users,
    loading,
    updateUser,
    deleteUser,
    toggleUserStatus,
    updateUserVerification,
    updateAdminRole,
    adjustBalance,
    searchUsers,
    filterUsers,
    fetchUsers,
    createUser
  } = useAdminUsers();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState<string>("");
  const [balanceReason, setBalanceReason] = useState("");
  const [transactionType, setTransactionType] = useState<"credit" | "debit">("credit");
  const { toast } = useToast();

  useEffect(() => {
    if (searchTerm) {
      searchUsers(searchTerm);
    } else if (filterStatus !== "all") {
      const filters: any = {};
      if (filterStatus === "active") filters.is_active = true;
      if (filterStatus === "inactive") filters.is_active = false;
      if (filterStatus === "admin") filters.is_admin = true;
      if (filterStatus === "pending") filters.verification_status = "pending";
      filterUsers(filters);
    } else {
      fetchUsers();
    }
  }, [searchTerm, filterStatus]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilterStatus("all");
  };

  const handleFilter = (value: string) => {
    setFilterStatus(value);
    setSearchTerm("");
  };

  const handleBalanceAdjustment = async (userId: string, amount: number, reason: string) => {
    await adjustBalance(userId, amount, reason);
    setBalanceAmount("");
    setBalanceReason("");
    setSelectedUser(null);
    setIsEditDialogOpen(false);
  };

  const handleCreditDebit = async (userId: string, amount: number, type: "credit" | "debit", reason: string) => {
    const adjustedAmount = type === "debit" ? -Math.abs(amount) : Math.abs(amount);
    await adjustBalance(userId, adjustedAmount, reason);
    
    // Create transaction record
    const transactionRecord = {
      id: `txn-${Date.now()}`,
      type: type === "credit" ? "Admin Credit" : "Admin Debit",
      amount: `$${Math.abs(amount).toFixed(2)}`,
      status: "Completed",
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      recipient: type === "credit" ? "Account Credit" : "Account Debit",
      reference: `ADM-${Date.now()}`,
      method: "Admin Adjustment",
      account: users.find(u => u.id === userId)?.account_number || "Unknown",
      fee: "$0.00",
      description: reason
    };

    toast({
      title: `${type === "credit" ? "Credit" : "Debit"} Successful`,
      description: `$${Math.abs(amount).toFixed(2)} has been ${type === "credit" ? "credited to" : "debited from"} the user's account.`,
    });

    setBalanceAmount("");
    setBalanceReason("");
    setSelectedUser(null);
    setIsEditDialogOpen(false);
  };

  const handleCreateUser = async (userData: any) => {
    try {
      await createUser(userData);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const canManageUsers = ['admin', 'super_admin'].includes(adminRole);
  const canManageBalance = ['admin', 'super_admin'].includes(adminRole);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">User Management</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <Badge variant="outline" className="text-xs sm:text-sm">
            Total: {users.length}
          </Badge>
          {canManageUsers && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 text-sm">
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add User</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>
                <CreateUserDialog 
                  onSubmit={handleCreateUser}
                  onCancel={() => setIsCreateDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">All Users</CardTitle>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <Select value={filterStatus} onValueChange={handleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
                <SelectItem value="pending">Pending Verification</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">User</TableHead>
                  <TableHead className="min-w-[100px]">Account</TableHead>
                  <TableHead className="min-w-[100px]">Balance</TableHead>
                  <TableHead className="min-w-[80px]">Status</TableHead>
                  <TableHead className="min-w-[80px]">Role</TableHead>
                  <TableHead className="min-w-[100px]">Verification</TableHead>
                  <TableHead className="min-w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm sm:text-base">{user.full_name || 'No name'}</p>
                        <p className="text-xs sm:text-sm text-gray-500 break-all">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs sm:text-sm">{user.account_number}</TableCell>
                    <TableCell className="text-sm sm:text-base">${user.balance?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? "default" : "secondary"} className="text-xs">
                        {user.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.is_admin ? (
                        <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                          <Shield className="h-3 w-3" />
                          <span className="hidden sm:inline">{user.admin_role?.replace('_', ' ').toUpperCase()}</span>
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">User</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.verification_status === 'approved' ? "default" : 
                               user.verification_status === 'rejected' ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {user.verification_status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedUser(user)}
                              className="p-1 sm:p-2"
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-lg sm:text-xl">Manage User: {user.full_name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 sm:space-y-6">
                              {/* User Status */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3">
                                <div>
                                  <h4 className="font-medium text-sm sm:text-base">Account Status</h4>
                                  <p className="text-xs sm:text-sm text-gray-600">
                                    Currently {user.is_active ? 'Active' : 'Inactive'}
                                  </p>
                                </div>
                                {canManageUsers && (
                                  <Button
                                    variant={user.is_active ? "destructive" : "default"}
                                    onClick={() => toggleUserStatus(user.id, !user.is_active)}
                                    size="sm"
                                    className="w-full sm:w-auto"
                                  >
                                    {user.is_active ? 'Deactivate' : 'Activate'}
                                  </Button>
                                )}
                              </div>

                              {/* Credit/Debit Balance */}
                              {canManageBalance && (
                                <div className="p-3 sm:p-4 border rounded-lg space-y-3 sm:space-y-4">
                                  <div>
                                    <h4 className="font-medium text-sm sm:text-base">Credit/Debit Balance</h4>
                                    <p className="text-xs sm:text-sm text-gray-600">
                                      Current balance: ${user.balance?.toFixed(2)}
                                    </p>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                                    <Button
                                      variant={transactionType === "credit" ? "default" : "outline"}
                                      onClick={() => setTransactionType("credit")}
                                      className="flex items-center gap-2"
                                      size="sm"
                                    >
                                      <Plus className="h-4 w-4" />
                                      Credit
                                    </Button>
                                    <Button
                                      variant={transactionType === "debit" ? "default" : "outline"}
                                      onClick={() => setTransactionType("debit")}
                                      className="flex items-center gap-2"
                                      size="sm"
                                    >
                                      <Minus className="h-4 w-4" />
                                      Debit
                                    </Button>
                                  </div>

                                  <div className="space-y-2">
                                    <Input
                                      type="number"
                                      placeholder="Amount"
                                      value={balanceAmount}
                                      onChange={(e) => setBalanceAmount(e.target.value)}
                                      className="text-sm"
                                    />
                                    <Input
                                      placeholder="Reason for adjustment"
                                      value={balanceReason}
                                      onChange={(e) => setBalanceReason(e.target.value)}
                                      className="text-sm"
                                    />
                                    <Button
                                      onClick={() => handleCreditDebit(
                                        user.id, 
                                        parseFloat(balanceAmount), 
                                        transactionType,
                                        balanceReason
                                      )}
                                      disabled={!balanceAmount || !balanceReason}
                                      className="w-full flex items-center gap-2"
                                      size="sm"
                                    >
                                      <CreditCard className="h-4 w-4" />
                                      {transactionType === "credit" ? "Credit Account" : "Debit Account"}
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {/* Verification Status */}
                              <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                  <h4 className="font-medium">Verification Status</h4>
                                  <p className="text-sm text-gray-600">
                                    Currently {user.verification_status}
                                  </p>
                                </div>
                                {canManageUsers && user.verification_status === 'pending' && (
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-green-600"
                                      onClick={() => updateUserVerification(user.id, true)}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-red-600"
                                      onClick={() => updateUserVerification(user.id, false)}
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Reject
                                    </Button>
                                  </div>
                                )}
                              </div>

                              {/* Admin Role */}
                              {adminRole === 'super_admin' && (
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                  <div>
                                    <h4 className="font-medium">Admin Role</h4>
                                    <p className="text-sm text-gray-600">
                                      {user.is_admin ? `Currently ${user.admin_role}` : 'Not an admin'}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    {!user.is_admin ? (
                                      <Select onValueChange={(role) => updateAdminRole(user.id, role)}>
                                        <SelectTrigger className="w-40">
                                          <SelectValue placeholder="Make Admin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="support">Support</SelectItem>
                                          <SelectItem value="moderator">Moderator</SelectItem>
                                          <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    ) : (
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => updateAdminRole(user.id)}
                                      >
                                        Revoke Admin
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>

                        {canManageUsers && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 p-1 sm:p-2"
                            onClick={() => deleteUser(user.id)}
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
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

export default UserManagement;
