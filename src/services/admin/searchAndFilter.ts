
import { supabase } from '@/integrations/supabase/client';
import { AdminUser, UserFilters } from './types';

export class SearchAndFilterService {
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
        verification_status: (user.verification_status as 'pending' | 'approved' | 'rejected') || 'pending'
      })) || [];
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  static async filterUsers(filters: UserFilters): Promise<AdminUser[]> {
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
        verification_status: (user.verification_status as 'pending' | 'approved' | 'rejected') || 'pending'
      })) || [];
    } catch (error) {
      console.error('Error filtering users:', error);
      return [];
    }
  }
}
