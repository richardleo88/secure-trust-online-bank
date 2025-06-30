
import { useState, useEffect } from 'react';
import { AdminUserService, AdminUser, UserRequest } from '@/services/adminUserService';
import { useToast } from '@/hooks/use-toast';

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [requests, setRequests] = useState<UserRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersData = await AdminUserService.getAllUsers();
      setUsers(usersData);
    } catch (err) {
      setError('Failed to fetch users');
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch all requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const requestsData = await AdminUserService.getAllRequests();
      setRequests(requestsData);
    } catch (err) {
      setError('Failed to fetch requests');
      toast({
        title: "Error",
        description: "Failed to fetch requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create user
  const createUser = async (userData: Partial<AdminUser>) => {
    try {
      setLoading(true);
      const newUser = await AdminUserService.createUser(userData);
      setUsers(prev => [...prev, newUser]);
      toast({
        title: "Success",
        description: "User created successfully",
      });
      return newUser;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user
  const updateUser = async (id: string, updates: Partial<AdminUser>) => {
    try {
      setLoading(true);
      const updatedUser = await AdminUserService.updateUser(id, updates);
      if (updatedUser) {
        setUsers(prev => prev.map(user => 
          user.id === id ? updatedUser : user
        ));
        toast({
          title: "Success",
          description: "User updated successfully",
        });
      }
      return updatedUser;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (id: string) => {
    try {
      setLoading(true);
      const success = await AdminUserService.deleteUser(id);
      if (success) {
        setUsers(prev => prev.filter(user => user.id !== id));
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
      }
      return success;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Activate/Deactivate user
  const toggleUserStatus = async (id: string, activate: boolean) => {
    try {
      setLoading(true);
      const success = activate 
        ? await AdminUserService.activateUser(id)
        : await AdminUserService.deactivateUser(id);
      
      if (success) {
        await fetchUsers(); // Refresh users list
        toast({
          title: "Success",
          description: `User ${activate ? 'activated' : 'deactivated'} successfully`,
        });
      }
      return success;
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to ${activate ? 'activate' : 'deactivate'} user`,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Approve/Reject user verification
  const updateUserVerification = async (id: string, approve: boolean, reason?: string) => {
    try {
      setLoading(true);
      const success = approve 
        ? await AdminUserService.approveUser(id)
        : await AdminUserService.rejectUser(id, reason);
      
      if (success) {
        await fetchUsers(); // Refresh users list
        toast({
          title: "Success",
          description: `User verification ${approve ? 'approved' : 'rejected'} successfully`,
        });
      }
      return success;
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to ${approve ? 'approve' : 'reject'} user verification`,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Assign/Revoke admin role
  const updateAdminRole = async (id: string, role?: string) => {
    try {
      setLoading(true);
      const success = role 
        ? await AdminUserService.assignAdminRole(id, role)
        : await AdminUserService.revokeAdminRole(id);
      
      if (success) {
        await fetchUsers(); // Refresh users list
        toast({
          title: "Success",
          description: `Admin role ${role ? 'assigned' : 'revoked'} successfully`,
        });
      }
      return success;
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to ${role ? 'assign' : 'revoke'} admin role`,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Adjust user balance
  const adjustBalance = async (id: string, amount: number, reason: string) => {
    try {
      setLoading(true);
      const success = await AdminUserService.adjustBalance(id, amount, reason);
      if (success) {
        await fetchUsers(); // Refresh users list
        toast({
          title: "Success",
          description: "Balance adjusted successfully",
        });
      }
      return success;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to adjust balance",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Approve/Reject request
  const updateRequestStatus = async (id: string, approve: boolean, reviewerId: string, reason?: string) => {
    try {
      setLoading(true);
      const success = approve 
        ? await AdminUserService.approveRequest(id, reviewerId)
        : await AdminUserService.rejectRequest(id, reviewerId, reason);
      
      if (success) {
        await fetchRequests(); // Refresh requests list
        await fetchUsers(); // Refresh users list in case the request affected user data
        toast({
          title: "Success",
          description: `Request ${approve ? 'approved' : 'rejected'} successfully`,
        });
      }
      return success;
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to ${approve ? 'approve' : 'reject'} request`,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Search users
  const searchUsers = async (query: string) => {
    try {
      setLoading(true);
      const results = await AdminUserService.searchUsers(query);
      setUsers(results);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to search users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter users
  const filterUsers = async (filters: {
    is_active?: boolean;
    is_admin?: boolean;
    verification_status?: string;
  }) => {
    try {
      setLoading(true);
      const results = await AdminUserService.filterUsers(filters);
      setUsers(results);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to filter users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchUsers();
    fetchRequests();
  }, []);

  return {
    users,
    requests,
    loading,
    error,
    // User operations
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    updateUserVerification,
    updateAdminRole,
    adjustBalance,
    // Request operations
    updateRequestStatus,
    // Search and filter
    searchUsers,
    filterUsers,
    // Refresh data
    fetchUsers,
    fetchRequests,
  };
};
