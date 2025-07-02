interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  account_number: string;
  balance: number;
  is_admin: boolean;
  is_active: boolean;
  phone?: string;
  verification_status: string;
  created_at: string;
  admin_role: string;
}

interface UserRequest {
  id: string;
  user_id: string;
  request_type: string;
  status: string;
  description?: string;
  metadata?: any;
  created_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
}

class MockAdminService {
  private adminUsers: AdminUser[] = [
    {
      id: '1',
      full_name: 'Richard Admin',
      email: 'richard@gmail.com',
      account_number: '****1234',
      balance: 15000.50,
      is_admin: true,
      is_active: true,
      phone: '+1-555-0123',
      verification_status: 'verified',
      created_at: new Date().toISOString(),
      admin_role: 'super_admin'
    },
    {
      id: '2',
      full_name: 'Test User',
      email: 'user@test.com',
      account_number: '****5678',
      balance: 5000.00,
      is_admin: false,
      is_active: true,
      phone: '+1-555-0456',
      verification_status: 'pending',
      created_at: new Date().toISOString(),
      admin_role: 'user'
    }
  ];

  private userRequests: UserRequest[] = [
    {
      id: '1',
      user_id: '2',
      request_type: 'account_verification',
      status: 'pending',
      created_at: new Date().toISOString()
    }
  ];

  // User management methods
  async getAllUsers(): Promise<AdminUser[]> {
    return this.adminUsers;
  }

  async getAllRequests(): Promise<UserRequest[]> {
    return this.userRequests;
  }

  async createUser(userData: Partial<AdminUser>): Promise<AdminUser> {
    const newUser: AdminUser = {
      id: Date.now().toString(),
      full_name: userData.full_name || '',
      email: userData.email || '',
      account_number: '****' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      balance: userData.balance || 0,
      is_admin: userData.is_admin || false,
      is_active: userData.is_active || true,
      phone: userData.phone || '',
      verification_status: userData.verification_status || 'pending',
      created_at: new Date().toISOString(),
      admin_role: userData.admin_role || 'user'
    };
    
    this.adminUsers.push(newUser);
    return newUser;
  }

  async updateUser(id: string, updates: Partial<AdminUser>): Promise<AdminUser | null> {
    const index = this.adminUsers.findIndex(user => user.id === id);
    if (index !== -1) {
      this.adminUsers[index] = { ...this.adminUsers[index], ...updates };
      return this.adminUsers[index];
    }
    return null;
  }

  async deleteUser(id: string): Promise<boolean> {
    const index = this.adminUsers.findIndex(user => user.id === id);
    if (index !== -1) {
      this.adminUsers.splice(index, 1);
      return true;
    }
    return false;
  }

  async activateUser(id: string): Promise<boolean> {
    return this.updateUser(id, { is_active: true }) !== null;
  }

  async deactivateUser(id: string): Promise<boolean> {
    return this.updateUser(id, { is_active: false }) !== null;
  }

  async approveUser(id: string): Promise<boolean> {
    return this.updateUser(id, { verification_status: 'verified' }) !== null;
  }

  async rejectUser(id: string, reason?: string): Promise<boolean> {
    return this.updateUser(id, { verification_status: 'rejected' }) !== null;
  }

  async assignAdminRole(id: string, role: string): Promise<boolean> {
    return this.updateUser(id, { is_admin: true }) !== null;
  }

  async revokeAdminRole(id: string): Promise<boolean> {
    return this.updateUser(id, { is_admin: false }) !== null;
  }

  async adjustBalance(id: string, amount: number, reason: string): Promise<boolean> {
    const user = this.adminUsers.find(u => u.id === id);
    if (user) {
      user.balance += amount;
      return true;
    }
    return false;
  }

  async searchUsers(query: string): Promise<AdminUser[]> {
    return this.adminUsers.filter(user => 
      user.full_name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );
  }

  async filterUsers(filters: {
    is_active?: boolean;
    is_admin?: boolean;
    verification_status?: string;
  }): Promise<AdminUser[]> {
    return this.adminUsers.filter(user => {
      if (filters.is_active !== undefined && user.is_active !== filters.is_active) return false;
      if (filters.is_admin !== undefined && user.is_admin !== filters.is_admin) return false;
      if (filters.verification_status && user.verification_status !== filters.verification_status) return false;
      return true;
    });
  }

  async approveRequest(id: string, reviewerId: string): Promise<boolean> {
    const index = this.userRequests.findIndex(req => req.id === id);
    if (index !== -1) {
      this.userRequests[index] = {
        ...this.userRequests[index],
        status: 'approved',
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString()
      };
      return true;
    }
    return false;
  }

  async rejectRequest(id: string, reviewerId: string, reason?: string): Promise<boolean> {
    const index = this.userRequests.findIndex(req => req.id === id);
    if (index !== -1) {
      this.userRequests[index] = {
        ...this.userRequests[index],
        status: 'rejected',
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString()
      };
      return true;
    }
    return false;
  }
}

export const AdminUserService = new MockAdminService();
export type { AdminUser, UserRequest };