
import { supabase } from '@/integrations/supabase/client';
import { UserCrudService } from './userCrud';

export class BalanceManagementService {
  static async adjustBalance(id: string, amount: number, reason: string): Promise<boolean> {
    try {
      const user = await UserCrudService.getUserById(id);
      if (!user) return false;

      const newBalance = user.balance + amount;
      if (newBalance < 0) return false;

      await UserCrudService.updateUser(id, { balance: newBalance });

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
}
