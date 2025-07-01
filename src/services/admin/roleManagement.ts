
import { supabase } from '@/integrations/supabase/client';
import { UserCrudService } from './userCrud';

export class RoleManagementService {
  static async assignAdminRole(id: string, role: string): Promise<boolean> {
    try {
      // Update profile
      await UserCrudService.updateUser(id, { is_admin: true });
      
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
      await UserCrudService.updateUser(id, { is_admin: false });
      
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
}
