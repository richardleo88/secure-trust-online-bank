
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { mockDataService } from '@/services/mockDataService';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  transaction_type: string;
  recipient_name: string;
  recipient_account?: string;
  amount: number;
  fee: number;
  status: string;
  reference_number: string;
  description?: string;
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
      const { data, error } = await mockDataService.getTransactions(user.id);
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
      // First check current balance
      const { data: profile, error: balanceError } = await mockDataService.getProfile(user.id);
      if (balanceError || !profile) throw balanceError;

      const totalAmount = transactionData.amount + (transactionData.fee || 0);
      
      if (profile.balance < totalAmount) {
        toast({
          title: "Insufficient Funds",
          description: "Your account balance is insufficient for this transaction.",
          variant: "destructive",
        });
        return { error: 'Insufficient funds' };
      }

      // Create transaction with mock data
      const { data: transaction, error: transactionError } = await mockDataService.createTransaction({
        user_id: user.id,
        ...transactionData,
        fee: transactionData.fee || 0,
        status: 'completed' // Immediately complete the transaction
      });

      if (transactionError) throw transactionError;

      // Log the transaction creation
      await logActivity('transaction_create', 'transaction', transaction.id, {
        transaction_type: transactionData.transaction_type,
        amount: transactionData.amount,
        recipient: transactionData.recipient_name
      });

      // Refresh transactions list
      await fetchTransactions();

      toast({
        title: "Transfer Successful",
        description: `$${transactionData.amount.toFixed(2)} transferred to ${transactionData.recipient_name}. Reference: ${transaction.reference_number}`,
      });

      return { data: transaction, error: null };
    } catch (error: any) {
      console.error('Transaction creation error:', error);
      toast({
        title: "Transfer Failed",
        description: error.message || "Failed to process transfer",
        variant: "destructive",
      });
      return { error: error.message };
    }
  };

  const updateTransactionStatus = async (transactionId: string, status: string) => {
    if (!user) return;

    try {
      // Mock update - in real implementation, you'd update the transaction status
      console.log('Updating transaction status:', transactionId, status);

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
