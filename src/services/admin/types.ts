
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
  metadata?: any;
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

export interface UserFilters {
  is_active?: boolean;
  is_admin?: boolean;
  verification_status?: string;
}
