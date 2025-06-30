
import { useAuth } from '@/hooks/useAuth';

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

// Dummy data stores
let ADMIN_USERS: AdminUser[] = [
  {
    id: 'admin-123',
    email: 'richard@gmail.com',
    full_name: 'Richard Admin',
    account_number: '****5678',
    balance: 10000.00,
    created_at: '2024-01-01T00:00:00Z',
    is_admin: true,
    admin_role: 'super_admin',
    is_active: true,
    last_login: new Date().toISOString(),
    verification_status: 'approved',
    phone: '+1 (555) 123-4567',
    address: { city: 'New York', state: 'NY' }
  },
  {
    id: 'user-456',
    email: 'user@example.com',
    full_name: 'John Doe',
    account_number: '****1234',
    balance: 5000.00,
    created_at: '2024-01-01T00:00:00Z',
    is_admin: false,
    is_active: true,
    last_login: new Date().toISOString(),
    verification_status: 'approved',
    phone: '+1 (555) 987-6543',
    address: { city: 'Los Angeles', state: 'CA' }
  },
  {
    id: 'user-789',
    email: 'jane@example.com',
    full_name: 'Jane Smith',
    account_number: '****9876',
    balance: 2500.00,
    created_at: '2024-02-15T00:00:00Z',
    is_admin: false,
    is_active: false,
    verification_status: 'pending',
    phone: '+1 (555) 555-0123',
    address: { city: 'Chicago', state: 'IL' }
  }
];

let USER_REQUESTS: UserRequest[] = [
  {
    id: 'req-001',
    user_id: 'user-789',
    request_type: 'account_unlock',
    status: 'pending',
    description: 'Account locked due to multiple failed login attempts',
    requested_by: 'user-789',
    created_at: '2024-06-29T10:00:00Z'
  },
  {
    id: 'req-002',
    user_id: 'user-456',
    request_type: 'balance_adjustment',
    status: 'pending',
    description: 'Request to adjust balance due to transaction error',
    requested_by: 'user-456',
    created_at: '2024-06-29T11:30:00Z',
    metadata: { amount: 100.00, reason: 'Duplicate charge reversal' }
  }
];

export class AdminUserService {
  // User CRUD Operations
  static async getAllUsers(): Promise<AdminUser[]> {
    return Promise.resolve([...ADMIN_USERS]);
  }

  static async getUserById(id: string): Promise<AdminUser | null> {
    const user = ADMIN_USERS.find(u => u.id === id);
    return Promise.resolve(user || null);
  }

  static async createUser(userData: Partial<AdminUser>): Promise<AdminUser> {
    const newUser: AdminUser = {
      id: `user-${Date.now()}`,
      email: userData.email || '',
      full_name: userData.full_name || '',
      account_number: `****${Math.floor(1000 + Math.random() * 9000)}`,
      balance: userData.balance || 0,
      created_at: new Date().toISOString(),
      is_admin: userData.is_admin || false,
      admin_role: userData.admin_role,
      is_active: userData.is_active ?? true,
      verification_status: userData.verification_status || 'pending',
      phone: userData.phone,
      address: userData.address
    };

    ADMIN_USERS.push(newUser);
    return Promise.resolve(newUser);
  }

  static async updateUser(id: string, updates: Partial<AdminUser>): Promise<AdminUser | null> {
    const userIndex = ADMIN_USERS.findIndex(u => u.id === id);
    if (userIndex === -1) return Promise.resolve(null);

    ADMIN_USERS[userIndex] = { ...ADMIN_USERS[userIndex], ...updates };
    return Promise.resolve(ADMIN_USERS[userIndex]);
  }

  static async deleteUser(id: string): Promise<boolean> {
    const userIndex = ADMIN_USERS.findIndex(u => u.id === id);
    if (userIndex === -1) return Promise.resolve(false);

    ADMIN_USERS.splice(userIndex, 1);
    return Promise.resolve(true);
  }

  // User Status Management
  static async activateUser(id: string): Promise<boolean> {
    const user = await this.updateUser(id, { is_active: true });
    return Promise.resolve(!!user);
  }

  static async deactivateUser(id: string): Promise<boolean> {
    const user = await this.updateUser(id, { is_active: false });
    return Promise.resolve(!!user);
  }

  static async approveUser(id: string): Promise<boolean> {
    const user = await this.updateUser(id, { verification_status: 'approved' });
    return Promise.resolve(!!user);
  }

  static async rejectUser(id: string, reason?: string): Promise<boolean> {
    const user = await this.updateUser(id, { 
      verification_status: 'rejected',
      metadata: { rejection_reason: reason }
    });
    return Promise.resolve(!!user);
  }

  // Role Management
  static async assignAdminRole(id: string, role: string): Promise<boolean> {
    const user = await this.updateUser(id, { 
      is_admin: true, 
      admin_role: role 
    });
    return Promise.resolve(!!user);
  }

  static async revokeAdminRole(id: string): Promise<boolean> {
    const user = await this.updateUser(id, { 
      is_admin: false, 
      admin_role: undefined 
    });
    return Promise.resolve(!!user);
  }

  // Balance Management
  static async adjustBalance(id: string, amount: number, reason: string): Promise<boolean> {
    const user = ADMIN_USERS.find(u => u.id === id);
    if (!user) return Promise.resolve(false);

    const newBalance = user.balance + amount;
    if (newBalance < 0) return Promise.resolve(false);

    await this.updateUser(id, { balance: newBalance });
    return Promise.resolve(true);
  }

  // User Requests Management
  static async getAllRequests(): Promise<UserRequest[]> {
    return Promise.resolve([...USER_REQUESTS]);
  }

  static async getRequestById(id: string): Promise<UserRequest | null> {
    const request = USER_REQUESTS.find(r => r.id === id);
    return Promise.resolve(request || null);
  }

  static async getRequestsByUserId(userId: string): Promise<UserRequest[]> {
    const requests = USER_REQUESTS.filter(r => r.user_id === userId);
    return Promise.resolve(requests);
  }

  static async approveRequest(id: string, reviewerId: string): Promise<boolean> {
    const requestIndex = USER_REQUESTS.findIndex(r => r.id === id);
    if (requestIndex === -1) return Promise.resolve(false);

    USER_REQUESTS[requestIndex] = {
      ...USER_REQUESTS[requestIndex],
      status: 'approved',
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString()
    };

    // Execute the request based on type
    const request = USER_REQUESTS[requestIndex];
    await this.executeRequest(request);

    return Promise.resolve(true);
  }

  static async rejectRequest(id: string, reviewerId: string, reason?: string): Promise<boolean> {
    const requestIndex = USER_REQUESTS.findIndex(r => r.id === id);
    if (requestIndex === -1) return Promise.resolve(false);

    USER_REQUESTS[requestIndex] = {
      ...USER_REQUESTS[requestIndex],
      status: 'rejected',
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
      metadata: { ...USER_REQUESTS[requestIndex].metadata, rejection_reason: reason }
    };

    return Promise.resolve(true);
  }

  static async createRequest(requestData: Partial<UserRequest>): Promise<UserRequest> {
    const newRequest: UserRequest = {
      id: `req-${Date.now()}`,
      user_id: requestData.user_id || '',
      request_type: requestData.request_type || 'account_unlock',
      status: 'pending',
      description: requestData.description || '',
      requested_by: requestData.requested_by || '',
      created_at: new Date().toISOString(),
      metadata: requestData.metadata
    };

    USER_REQUESTS.push(newRequest);
    return Promise.resolve(newRequest);
  }

  // Execute approved requests
  private static async executeRequest(request: UserRequest): Promise<void> {
    switch (request.request_type) {
      case 'account_unlock':
        await this.activateUser(request.user_id);
        break;
      case 'balance_adjustment':
        if (request.metadata?.amount) {
          await this.adjustBalance(request.user_id, request.metadata.amount, request.description);
        }
        break;
      case 'role_change':
        if (request.metadata?.role) {
          await this.assignAdminRole(request.user_id, request.metadata.role);
        }
        break;
      case 'account_closure':
        await this.deactivateUser(request.user_id);
        break;
      case 'verification_review':
        await this.approveUser(request.user_id);
        break;
    }
  }

  // Search and Filter
  static async searchUsers(query: string): Promise<AdminUser[]> {
    const users = await this.getAllUsers();
    const filtered = users.filter(user => 
      user.email.toLowerCase().includes(query.toLowerCase()) ||
      user.full_name.toLowerCase().includes(query.toLowerCase()) ||
      user.account_number.includes(query)
    );
    return Promise.resolve(filtered);
  }

  static async filterUsers(filters: {
    is_active?: boolean;
    is_admin?: boolean;
    verification_status?: string;
  }): Promise<AdminUser[]> {
    const users = await this.getAllUsers();
    const filtered = users.filter(user => {
      if (filters.is_active !== undefined && user.is_active !== filters.is_active) return false;
      if (filters.is_admin !== undefined && user.is_admin !== filters.is_admin) return false;
      if (filters.verification_status && user.verification_status !== filters.verification_status) return false;
      return true;
    });
    return Promise.resolve(filtered);
  }
}
