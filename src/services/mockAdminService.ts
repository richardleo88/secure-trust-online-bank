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
  last_login?: string;
  profile_picture_url?: string;
}

interface ATMCard {
  id: string;
  user_id: string;
  card_number: string;
  card_type: 'debit' | 'credit';
  card_status: 'active' | 'blocked' | 'expired' | 'pending';
  expiry_date: string;
  daily_limit: number;
  monthly_limit: number;
  created_at: string;
  last_used?: string;
  pin_attempts: number;
}

interface CardActivity {
  id: string;
  card_id: string;
  activity_type: 'purchase' | 'withdrawal' | 'deposit' | 'pin_change' | 'status_change';
  amount?: number;
  location?: string;
  merchant?: string;
  status: 'success' | 'failed' | 'pending';
  created_at: string;
  description: string;
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

  private atmCards: ATMCard[] = [
    {
      id: '1',
      user_id: '1',
      card_number: '**** **** **** 1234',
      card_type: 'debit',
      card_status: 'active',
      expiry_date: '12/26',
      daily_limit: 1000,
      monthly_limit: 10000,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      last_used: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      pin_attempts: 0
    },
    {
      id: '2',
      user_id: '2',
      card_number: '**** **** **** 5678',
      card_type: 'debit',
      card_status: 'active',
      expiry_date: '08/27',
      daily_limit: 500,
      monthly_limit: 5000,
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      last_used: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      pin_attempts: 1
    }
  ];

  private cardActivities: CardActivity[] = [
    {
      id: '1',
      card_id: '1',
      activity_type: 'purchase',
      amount: 25.50,
      location: 'New York, NY',
      merchant: 'Coffee Shop',
      status: 'success',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Purchase at Coffee Shop'
    },
    {
      id: '2',
      card_id: '2',
      activity_type: 'withdrawal',
      amount: 100.00,
      location: 'ATM - Main St',
      status: 'success',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Cash withdrawal'
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

  // ATM Card management methods
  async getUserCards(userId: string): Promise<ATMCard[]> {
    return this.atmCards.filter(card => card.user_id === userId);
  }

  async getAllCards(): Promise<ATMCard[]> {
    return this.atmCards;
  }

  async createCard(userId: string, cardData: Partial<ATMCard>): Promise<ATMCard> {
    const newCard: ATMCard = {
      id: Date.now().toString(),
      user_id: userId,
      card_number: '**** **** **** ' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      card_type: cardData.card_type || 'debit',
      card_status: 'pending',
      expiry_date: cardData.expiry_date || this.generateExpiryDate(),
      daily_limit: cardData.daily_limit || 500,
      monthly_limit: cardData.monthly_limit || 5000,
      created_at: new Date().toISOString(),
      pin_attempts: 0
    };
    
    this.atmCards.push(newCard);
    
    // Log card creation activity
    this.cardActivities.push({
      id: Date.now().toString() + '_activity',
      card_id: newCard.id,
      activity_type: 'status_change',
      status: 'success',
      created_at: new Date().toISOString(),
      description: 'Card created and issued'
    });
    
    return newCard;
  }

  async updateCard(cardId: string, updates: Partial<ATMCard>): Promise<ATMCard | null> {
    const index = this.atmCards.findIndex(card => card.id === cardId);
    if (index !== -1) {
      const oldStatus = this.atmCards[index].card_status;
      this.atmCards[index] = { ...this.atmCards[index], ...updates };
      
      // Log status change activity
      if (updates.card_status && updates.card_status !== oldStatus) {
        this.cardActivities.push({
          id: Date.now().toString() + '_activity',
          card_id: cardId,
          activity_type: 'status_change',
          status: 'success',
          created_at: new Date().toISOString(),
          description: `Card status changed from ${oldStatus} to ${updates.card_status}`
        });
      }
      
      return this.atmCards[index];
    }
    return null;
  }

  async blockCard(cardId: string, reason: string): Promise<boolean> {
    const result = await this.updateCard(cardId, { card_status: 'blocked' });
    if (result) {
      this.cardActivities.push({
        id: Date.now().toString() + '_activity',
        card_id: cardId,
        activity_type: 'status_change',
        status: 'success',
        created_at: new Date().toISOString(),
        description: `Card blocked: ${reason}`
      });
    }
    return result !== null;
  }

  async unblockCard(cardId: string): Promise<boolean> {
    const result = await this.updateCard(cardId, { card_status: 'active' });
    if (result) {
      this.cardActivities.push({
        id: Date.now().toString() + '_activity',
        card_id: cardId,
        activity_type: 'status_change',
        status: 'success',
        created_at: new Date().toISOString(),
        description: 'Card unblocked and activated'
      });
    }
    return result !== null;
  }

  async updateCardLimits(cardId: string, dailyLimit: number, monthlyLimit: number): Promise<boolean> {
    const result = await this.updateCard(cardId, { 
      daily_limit: dailyLimit, 
      monthly_limit: monthlyLimit 
    });
    if (result) {
      this.cardActivities.push({
        id: Date.now().toString() + '_activity',
        card_id: cardId,
        activity_type: 'status_change',
        status: 'success',
        created_at: new Date().toISOString(),
        description: `Card limits updated: Daily $${dailyLimit}, Monthly $${monthlyLimit}`
      });
    }
    return result !== null;
  }

  async getCardActivities(cardId: string): Promise<CardActivity[]> {
    return this.cardActivities.filter(activity => activity.card_id === cardId);
  }

  async getAllCardActivities(): Promise<CardActivity[]> {
    return this.cardActivities;
  }

  async resetCardPin(cardId: string): Promise<boolean> {
    const result = await this.updateCard(cardId, { pin_attempts: 0 });
    if (result) {
      this.cardActivities.push({
        id: Date.now().toString() + '_activity',
        card_id: cardId,
        activity_type: 'pin_change',
        status: 'success',
        created_at: new Date().toISOString(),
        description: 'PIN reset by administrator'
      });
    }
    return result !== null;
  }

  private generateExpiryDate(): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 4);
    return (date.getMonth() + 1).toString().padStart(2, '0') + '/' + date.getFullYear().toString().slice(-2);
  }
}

export const AdminUserService = new MockAdminService();
export type { AdminUser, UserRequest, ATMCard, CardActivity };