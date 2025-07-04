interface User {
  id: string;
  email: string;
  full_name?: string;
  is_admin?: boolean;
}

interface Session {
  user: User;
  access_token: string;
}

class MockAuthService {
  private currentUser: User | null = null;
  private currentSession: Session | null = null;
  private listeners: ((session: Session | null) => void)[] = [];

  // Mock users - Test Credentials Documentation:
  // Admin: richard@gmail.com / AdminSecure2024!@#
  // Regular Users: user@test.com / password123, john@example.com / password123, jane@demo.com / password123
  private mockUsers = [
    {
      id: '1',
      email: 'richard@gmail.com',
      password: 'AdminSecure2024!@#',
      full_name: 'Richard Admin',
      is_admin: true
    },
    {
      id: '2',
      email: 'user@test.com',
      password: 'password123',
      full_name: 'Test User',
      is_admin: false
    },
    {
      id: '3',
      email: 'john@example.com',
      password: 'password123',
      full_name: 'John Doe',
      is_admin: false
    },
    {
      id: '4',
      email: 'jane@demo.com',
      password: 'password123',
      full_name: 'Jane Smith',
      is_admin: false
    },
    {
      id: '5',
      email: 'user@example.com',
      password: 'user123',
      full_name: 'Demo User',
      is_admin: false
    }
  ];

  constructor() {
    // Check localStorage for persisted session with error handling
    try {
      const savedSession = localStorage.getItem('mock_session');
      if (savedSession) {
        this.currentSession = JSON.parse(savedSession);
        this.currentUser = this.currentSession?.user || null;
        console.log('Restored session for user:', this.currentUser?.email);
      }
    } catch (error) {
      console.error('Error restoring session from localStorage:', error);
      localStorage.removeItem('mock_session');
    }
  }

  async signIn(email: string, password: string) {
    console.log('Attempting login for:', email);
    const user = this.mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      console.error('Login failed - user not found or password mismatch for:', email);
      return { error: { message: 'Invalid login credentials' } };
    }

    console.log('Login successful for:', email, user.is_admin ? '(admin)' : '(user)');

    const { password: _, ...userWithoutPassword } = user;
    this.currentUser = userWithoutPassword;
    this.currentSession = {
      user: userWithoutPassword,
      access_token: 'mock_token_' + Date.now()
    };

    // Persist session
    localStorage.setItem('mock_session', JSON.stringify(this.currentSession));
    
    // Notify listeners
    this.listeners.forEach(listener => listener(this.currentSession));
    
    return { error: null };
  }

  async signUp(email: string, password: string, fullName: string) {
    // Check if user already exists
    if (this.mockUsers.find(u => u.email === email)) {
      return { error: { message: 'User already registered' } };
    }

    // Add new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      full_name: fullName,
      is_admin: false
    };
    
    this.mockUsers.push(newUser);
    
    return { error: null };
  }

  async signOut() {
    this.currentUser = null;
    this.currentSession = null;
    localStorage.removeItem('mock_session');
    
    // Notify listeners
    this.listeners.forEach(listener => listener(null));
  }

  getSession() {
    return Promise.resolve({ data: { session: this.currentSession } });
  }

  getUser() {
    return this.currentUser;
  }

  onAuthStateChange(callback: (session: Session | null) => void) {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            const index = this.listeners.indexOf(callback);
            if (index > -1) {
              this.listeners.splice(index, 1);
            }
          }
        }
      }
    };
  }
}

export const mockAuth = new MockAuthService();