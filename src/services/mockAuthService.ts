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

  // Mock users
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
    }
  ];

  constructor() {
    // Check localStorage for persisted session
    const savedSession = localStorage.getItem('mock_session');
    if (savedSession) {
      this.currentSession = JSON.parse(savedSession);
      this.currentUser = this.currentSession?.user || null;
    }
  }

  async signIn(email: string, password: string) {
    const user = this.mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return { error: { message: 'Invalid login credentials' } };
    }

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