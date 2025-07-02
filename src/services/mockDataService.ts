interface Profile {
  id: string;
  full_name: string;
  email: string;
  account_number: string;
  balance: number;
  is_admin: boolean;
  phone?: string;
  verification_status: string;
  created_at: string;
}

interface Transaction {
  id: string;
  user_id: string;
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

interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  metadata?: any;
  created_at: string;
}

class MockDataService {
  private profiles: Profile[] = [
    {
      id: '1',
      full_name: 'Richard Admin',
      email: 'richard@gmail.com',
      account_number: '****1234',
      balance: 15000.50,
      is_admin: true,
      phone: '+1-555-0123',
      verification_status: 'verified',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      full_name: 'Test User',
      email: 'user@test.com',
      account_number: '****5678',
      balance: 5000.00,
      is_admin: false,
      phone: '+1-555-0456',
      verification_status: 'pending',
      created_at: new Date().toISOString()
    }
  ];

  private transactions: Transaction[] = [
    {
      id: '1',
      user_id: '1',
      transaction_type: 'wire',
      recipient_name: 'John Doe',
      recipient_account: '****9876',
      amount: 1500.00,
      fee: 25.00,
      status: 'completed',
      reference_number: 'WIRE-20250101-12345',
      description: 'Wire transfer to John Doe',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      completed_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: '2',
      user_id: '2',
      transaction_type: 'ach',
      recipient_name: 'Jane Smith',
      recipient_account: '****3456',
      amount: 500.00,
      fee: 5.00,
      status: 'completed',
      reference_number: 'ACH-20250101-67890',
      description: 'ACH transfer to Jane Smith',
      created_at: new Date(Date.now() - 43200000).toISOString(),
      completed_at: new Date(Date.now() - 43200000).toISOString()
    }
  ];

  private activityLogs: ActivityLog[] = [
    {
      id: '1',
      user_id: '1',
      action: 'login',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      user_id: '1',
      action: 'transaction_create',
      resource_type: 'transaction',
      resource_id: '1',
      metadata: { amount: 1500 },
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  // Profile methods
  getProfile(userId: string): Promise<{ data: Profile | null; error: any }> {
    const profile = this.profiles.find(p => p.id === userId);
    return Promise.resolve({ data: profile || null, error: null });
  }

  updateProfile(userId: string, updates: Partial<Profile>): Promise<{ data: Profile | null; error: any }> {
    const index = this.profiles.findIndex(p => p.id === userId);
    if (index !== -1) {
      this.profiles[index] = { ...this.profiles[index], ...updates };
      return Promise.resolve({ data: this.profiles[index], error: null });
    }
    return Promise.resolve({ data: null, error: { message: 'Profile not found' } });
  }

  // Transaction methods
  getTransactions(userId: string): Promise<{ data: Transaction[]; error: any }> {
    const userTransactions = this.transactions.filter(t => t.user_id === userId);
    return Promise.resolve({ data: userTransactions, error: null });
  }

  getAllTransactions(): Promise<{ data: Transaction[]; error: any }> {
    return Promise.resolve({ data: this.transactions, error: null });
  }

  createTransaction(transactionData: Omit<Transaction, 'id' | 'created_at' | 'reference_number'> & { fee?: number; recipient_account?: string; description?: string }): Promise<{ data: Transaction; error: any }> {
    const newTransaction: Transaction = {
      ...transactionData,
      fee: transactionData.fee || 0,
      recipient_account: transactionData.recipient_account || '',
      description: transactionData.description || '',
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      reference_number: this.generateReferenceNumber(transactionData.transaction_type)
    };
    
    this.transactions.push(newTransaction);
    
    // Update user balance
    const profile = this.profiles.find(p => p.id === transactionData.user_id);
    if (profile) {
      profile.balance -= (transactionData.amount + transactionData.fee);
    }
    
    return Promise.resolve({ data: newTransaction, error: null });
  }

  // Activity log methods
  getActivityLogs(userId: string): Promise<{ data: ActivityLog[]; error: any }> {
    const userLogs = this.activityLogs.filter(log => log.user_id === userId);
    return Promise.resolve({ data: userLogs, error: null });
  }

  logActivity(activityData: Omit<ActivityLog, 'id' | 'created_at'>): Promise<{ data: ActivityLog; error: any }> {
    const newLog: ActivityLog = {
      ...activityData,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    
    this.activityLogs.push(newLog);
    return Promise.resolve({ data: newLog, error: null });
  }

  // Admin methods
  getAllProfiles(): Promise<{ data: Profile[]; error: any }> {
    return Promise.resolve({ data: this.profiles, error: null });
  }

  // Helper methods
  private generateReferenceNumber(type: string): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `${type.toUpperCase()}-${date}-${random}`;
  }

  // Mock RPC functions
  generateAccountNumber(): string {
    return '****' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  }
}

export const mockDataService = new MockDataService();