
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  transaction_type: string;
  recipient_name: string;
  recipient_account: string;
  amount: number;
  fee: number;
  status: string;
  reference_number: string;
  description: string;
  created_at: string;
  completed_at?: string;
  metadata?: any;
}

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logActivity } = useAuth();
  const { toast } = useToast();

  const fetchTransactions = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (transactionData: {
    transaction_type: string;
    recipient_name: string;
    recipient_account?: string;
    amount: number;
    fee?: number;
    description?: string;
    metadata?: any;
  }) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      // Generate reference number using the database function
      const { data: refData, error: refError } = await supabase
        .rpc('generate_reference_number', { transaction_type: transactionData.transaction_type });

      if (refError) throw refError;

      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          ...transactionData,
          reference_number: refData,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Log the transaction creation
      await logActivity('transaction_create', 'transaction', data.id, {
        transaction_type: transactionData.transaction_type,
        amount: transactionData.amount,
        recipient: transactionData.recipient_name
      });

      // Refresh transactions list
      await fetchTransactions();

      toast({
        title: "Transaction Created",
        description: `Transaction ${data.reference_number} has been submitted successfully.`,
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Transaction creation error:', error);
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to create transaction",
        variant: "destructive",
      });
      return { error: error.message };
    }
  };

  const updateTransactionStatus = async (transactionId: string, status: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .update({ 
          status,
          completed_at: status === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', transactionId)
        .eq('user_id', user.id);

      if (error) throw error;

      await logActivity('transaction_status_update', 'transaction', transactionId, {
        new_status: status
      });

      await fetchTransactions();
    } catch (error) {
      console.error('Error updating transaction status:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  return {
    transactions,
    loading,
    createTransaction,
    updateTransactionStatus,
    refreshTransactions: fetchTransactions
  };
};
