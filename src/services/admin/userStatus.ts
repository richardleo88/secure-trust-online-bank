
import { supabase } from '@/integrations/supabase/client';
import { UserCrudService } from './userCrud';

export class UserStatusService {
  static async activateUser(id: string): Promise<boolean> {
    return !!(await UserCrudService.updateUser(id, { verification_status: 'approved' }));
  }

  static async deactivateUser(id: string): Promise<boolean> {
    return !!(await UserCrudService.updateUser(id, { verification_status: 'rejected' }));
  }

  static async approveUser(id: string): Promise<boolean> {
    return !!(await UserCrudService.updateUser(id, { verification_status: 'approved' }));
  }

  static async rejectUser(id: string, reason?: string): Promise<boolean> {
    return !!(await UserCrudService.updateUser(id, { 
      verification_status: 'rejected',
      metadata: { rejection_reason: reason }
    }));
  }
}
