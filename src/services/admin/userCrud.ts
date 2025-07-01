
import { supabase } from '@/integrations/supabase/client';
import { AdminUser } from './types';

export class UserCrudService {
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
        verification_status: (user.verification_status as 'pending' | 'approved' | 'rejected') || 'pending'
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
      
      return {
        ...data,
        is_active: true,
        last_login: new Date().toISOString(),
        verification_status: (data.verification_status as 'pending' | 'approved' | 'rejected') || 'pending'
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
        },
        email_confirm: true
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
      
      return {
        ...data,
        is_active: true,
        last_login: new Date().toISOString(),
        verification_status: (data.verification_status as 'pending' | 'approved' | 'rejected') || 'pending'
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
}
