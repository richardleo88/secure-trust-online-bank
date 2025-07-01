
import { supabase } from '@/integrations/supabase/client';
import { UserRequest } from './types';

export class RequestManagementService {
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
        status: ticket.status as any,
        description: ticket.description,
        requested_by: ticket.user_id || '',
        created_at: ticket.created_at || new Date().toISOString()
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
}
