
import { supabase } from '@/integrations/supabase/client';

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  account_number: string;
  balance: number;
  created_at: string;
  is_admin: boolean;
  admin_role?: string;
  is_active: boolean;
  last_login?: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  phone?: string;
  address?: any;
  metadata?: any;
}

export interface UserRequest {
  id: string;
  user_id: string;
  request_type: 'account_unlock' | 'balance_adjustment' | 'role_change' | 'account_closure' | 'verification_review';
  status: 'pending' | 'approved' | 'rejected';
  description: string;
  requested_by: string;
  reviewed_by?: string;
  created_at: string;
  reviewed_at?: string;
  metadata?: any;
}

export class AdminUserService {
  // User CRUD Operations
  static async getAllUsers(): Promise<AdminUser[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          account_number,
          balance,
          created_at,
          is_admin,
          verification_status,
          phone,
          address
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data?.map(user => ({
        ...user,
        is_active: true,
        last_login: new Date().toISOString(),
        verification_status: user.verification_status as 'pending' | 'approved' | 'rejected' || 'pending',
        email: user.email || '',
        full_name: user.full_name || '',
        account_number: user.account_number || '',
        balance: user.balance || 0,
        created_at: user.created_at || new Date().toISOString(),
        is_admin: user.is_admin || false,
        phone: user.phone || undefined,
        address: user.address || undefined
      })) || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  static async getUserById(id: string): Promise<AdminUser | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (!data) return null;

      return {
        ...data,
        is_active: true,
        last_login: new Date().toISOString(),
        verification_status: data.verification_status as 'pending' | 'approved' | 'rejected' || 'pending',
        email: data.email || '',
        full_name: data.full_name || '',
        account_number: data.account_number || '',
        balance: data.balance || 0,
        created_at: data.created_at || new Date().toISOString(),
        is_admin: data.is_admin || false
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  static async createUser(userData: Partial<AdminUser>): Promise<AdminUser> {
    try {
      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email!,
        password: 'TempPassword123!',
        user_metadata: {
          full_name: userData.full_name
        }
      });

      if (authError) throw authError;

      // The profile will be created automatically by the trigger
      // Wait a moment then return the created user
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const createdUser = await this.getUserById(authData.user.id);
      if (!createdUser) throw new Error('Failed to create user profile');
      
      return createdUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async updateUser(id: string, updates: Partial<AdminUser>): Promise<AdminUser | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      if (!data) return null;

      return {
        ...data,
        is_active: true,
        last_login: new Date().toISOString(),
        verification_status: data.verification_status as 'pending' | 'approved' | 'rejected' || 'pending',
        email: data.email || '',
        full_name: data.full_name || '',
        account_number: data.account_number || '',
        balance: data.balance || 0,
        created_at: data.created_at || new Date().toISOString(),
        is_admin: data.is_admin || false
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  static async deleteUser(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.admin.deleteUser(id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  // User Status Management
  static async activateUser(id: string): Promise<boolean> {
    return !!(await this.updateUser(id, { verification_status: 'approved' }));
  }

  static async deactivateUser(id: string): Promise<boolean> {
    return !!(await this.updateUser(id, { verification_status: 'rejected' }));
  }

  static async approveUser(id: string): Promise<boolean> {
    return !!(await this.updateUser(id, { verification_status: 'approved' }));
  }

  static async rejectUser(id: string, reason?: string): Promise<boolean> {
    return !!(await this.updateUser(id, { 
      verification_status: 'rejected',
      metadata: { rejection_reason: reason }
    }));
  }

  // Role Management
  static async assignAdminRole(id: string, role: string): Promise<boolean> {
    try {
      // Update profile
      await this.updateUser(id, { is_admin: true });
      
      // Update admin_users table
      const { error } = await supabase
        .from('admin_users')
        .upsert({
          user_id: id,
          admin_role: role as any,
          is_active: true
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error assigning admin role:', error);
      return false;
    }
  }

  static async revokeAdminRole(id: string): Promise<boolean> {
    try {
      // Update profile
      await this.updateUser(id, { is_admin: false });
      
      // Update admin_users table
      const { error } = await supabase
        .from('admin_users')
        .update({ is_active: false })
        .eq('user_id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error revoking admin role:', error);
      return false;
    }
  }

  // Balance Management
  static async adjustBalance(id: string, amount: number, reason: string): Promise<boolean> {
    try {
      const user = await this.getUserById(id);
      if (!user) return false;

      const newBalance = user.balance + amount;
      if (newBalance < 0) return false;

      await this.updateUser(id, { balance: newBalance });

      // Log the transaction
      await supabase.from('transactions').insert({
        user_id: id,
        transaction_type: amount > 0 ? 'deposit' : 'withdrawal',
        amount: Math.abs(amount),
        status: 'completed',
        description: reason,
        reference_number: `ADM-${Date.now()}`,
        completed_at: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error('Error adjusting balance:', error);
      return false;
    }
  }

  // Request Management using support_tickets table
  static async getAllRequests(): Promise<UserRequest[]> {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data?.map(ticket => ({
        id: ticket.id,
        user_id: ticket.user_id || '',
        request_type: 'account_unlock' as const,
        status: (ticket.status as 'pending' | 'approved' | 'rejected') || 'pending',
        description: ticket.description,
        requested_by: ticket.user_id || '',
        created_at: ticket.created_at || new Date().toISOString(),
        reviewed_by: ticket.assigned_to || undefined,
        reviewed_at: ticket.resolved_at || undefined
      })) || [];
    } catch (error) {
      console.error('Error fetching requests:', error);
      return [];
    }
  }

  static async approveRequest(id: string, reviewerId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ 
          status: 'resolved',
          assigned_to: reviewerId,
          resolved_at: new Date().toISOString()
        })
        .eq('id', id);

      return !error;
    } catch (error) {
      console.error('Error approving request:', error);
      return false;
    }
  }

  static async rejectRequest(id: string, reviewerId: string, reason?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ 
          status: 'closed',
          assigned_to: reviewerId,
          resolved_at: new Date().toISOString()
        })
        .eq('id', id);

      return !error;
    } catch (error) {
      console.error('Error rejecting request:', error);
      return false;
    }
  }

  // Search and Filter
  static async searchUsers(query: string): Promise<AdminUser[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`email.ilike.%${query}%,full_name.ilike.%${query}%,account_number.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data?.map(user => ({
        ...user,
        is_active: true,
        last_login: new Date().toISOString(),
        verification_status: user.verification_status as 'pending' | 'approved' | 'rejected' || 'pending',
        email: user.email || '',
        full_name: user.full_name || '',
        account_number: user.account_number || '',
        balance: user.balance || 0,
        created_at: user.created_at || new Date().toISOString(),
        is_admin: user.is_admin || false
      })) || [];
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  static async filterUsers(filters: {
    is_active?: boolean;
    is_admin?: boolean;
    verification_status?: string;
  }): Promise<AdminUser[]> {
    try {
      let query = supabase.from('profiles').select('*');

      if (filters.is_admin !== undefined) {
        query = query.eq('is_admin', filters.is_admin);
      }
      if (filters.verification_status) {
        query = query.eq('verification_status', filters.verification_status);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      
      return data?.map(user => ({
        ...user,
        is_active: true,
        last_login: new Date().toISOString(),
        verification_status: user.verification_status as 'pending' | 'approved' | 'rejected' || 'pending',
        email: user.email || '',
        full_name: user.full_name || '',
        account_number: user.account_number || '',
        balance: user.balance || 0,
        created_at: user.created_at || new Date().toISOString(),
        is_admin: user.is_admin || false
      })) || [];
    } catch (error) {
      console.error('Error filtering users:', error);
      return [];
    }
  }
}
