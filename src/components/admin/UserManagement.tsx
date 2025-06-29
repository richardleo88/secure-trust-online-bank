
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Search, UserPlus, Edit, Trash2, Shield } from "lucide-react";

interface UserManagementProps {
  adminRole: string;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  account_number: string;
  balance: number;
  created_at: string;
  is_admin?: boolean;
  admin_role?: string;
}

const UserManagement = ({ adminRole }: UserManagementProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Get admin status for each user
      const { data: adminUsers, error: adminError } = await supabase
        .from('admin_users')
        .select('user_id, admin_role, is_active');

      if (adminError && adminError.code !== 'PGRST116') {
        console.error('Admin users fetch error:', adminError);
      }

      const usersWithAdminStatus = profiles?.map(profile => ({
        ...profile,
        is_admin: adminUsers?.some(admin => admin.user_id === profile.id && admin.is_active),
        admin_role: adminUsers?.find(admin => admin.user_id === profile.id && admin.is_active)?.admin_role
      })) || [];

      setUsers(usersWithAdminStatus);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.account_number?.includes(searchTerm)
  );

  const makeAdmin = async (userId: string, role: 'support' | 'moderator' | 'admin' | 'super_admin' = 'support') => {
    try {
      const { error } = await supabase
        .from('admin_users')
        .upsert({
          user_id: userId,
          admin_role: role,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User admin status updated successfully",
      });

      fetchUsers();
    } catch (error: any) {
      console.error('Error updating admin status:', error);
      toast({
        title: "Error",
        description: "Failed to update admin status",
        variant: "destructive",
      });
    }
  };

  const revokeAdmin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ is_active: false })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Admin access revoked successfully",
      });

      fetchUsers();
    } catch (error: any) {
      console.error('Error revoking admin access:', error);
      toast({
        title: "Error",
        description: "Failed to revoke admin access",
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
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
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
                  <TableHead>User</TableHead>
                  <TableHead>Account Number</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
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
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {!user.is_admin && adminRole === 'super_admin' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => makeAdmin(user.id)}
                          >
                            Make Admin
                          </Button>
                        )}
                        {user.is_admin && adminRole === 'super_admin' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => revokeAdmin(user.id)}
                          >
                            Revoke Admin
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
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
