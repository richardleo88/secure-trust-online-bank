
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { Search, UserPlus, Edit, Trash2, Shield, CheckCircle, XCircle, DollarSign } from "lucide-react";

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
    fetchUsers
  } = useAdminUsers();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState<string>("");
  const [balanceReason, setBalanceReason] = useState("");

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

  const canManageUsers = ['admin', 'super_admin'].includes(adminRole);
  const canManageBalance = ['admin', 'super_admin'].includes(adminRole);

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
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            Total: {users.length}
          </Badge>
          {canManageUsers && (
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={handleFilter}>
              <SelectTrigger className="w-48">
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
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.full_name || 'No name'}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{user.account_number}</TableCell>
                    <TableCell>${user.balance?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? "default" : "secondary"}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.is_admin ? (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          {user.admin_role?.replace('_', ' ').toUpperCase()}
                        </Badge>
                      ) : (
                        <Badge variant="outline">User</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.verification_status === 'approved' ? "default" : 
                               user.verification_status === 'rejected' ? "destructive" : "secondary"}
                      >
                        {user.verification_status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Manage User: {user.full_name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              {/* User Status */}
                              <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                  <h4 className="font-medium">Account Status</h4>
                                  <p className="text-sm text-gray-600">
                                    Currently {user.is_active ? 'Active' : 'Inactive'}
                                  </p>
                                </div>
                                {canManageUsers && (
                                  <Button
                                    variant={user.is_active ? "destructive" : "default"}
                                    onClick={() => toggleUserStatus(user.id, !user.is_active)}
                                  >
                                    {user.is_active ? 'Deactivate' : 'Activate'}
                                  </Button>
                                )}
                              </div>

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

                              {/* Balance Adjustment */}
                              {canManageBalance && (
                                <div className="p-4 border rounded-lg space-y-4">
                                  <div>
                                    <h4 className="font-medium">Balance Adjustment</h4>
                                    <p className="text-sm text-gray-600">
                                      Current balance: ${user.balance?.toFixed(2)}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Input
                                      type="number"
                                      placeholder="Amount (+/-)"
                                      value={balanceAmount}
                                      onChange={(e) => setBalanceAmount(e.target.value)}
                                      className="flex-1"
                                    />
                                    <Input
                                      placeholder="Reason"
                                      value={balanceReason}
                                      onChange={(e) => setBalanceReason(e.target.value)}
                                      className="flex-1"
                                    />
                                    <Button
                                      onClick={() => handleBalanceAdjustment(
                                        user.id, 
                                        parseFloat(balanceAmount), 
                                        balanceReason
                                      )}
                                      disabled={!balanceAmount || !balanceReason}
                                    >
                                      <DollarSign className="h-4 w-4 mr-1" />
                                      Adjust
                                    </Button>
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
                            className="text-red-600 hover:text-red-700"
                            onClick={() => deleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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
