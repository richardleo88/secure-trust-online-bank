
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

// Dummy user type to replace Supabase User
interface DummyUser {
  id: string;
  email: string;
  created_at?: string; // Add missing created_at property
  user_metadata?: {
    full_name?: string;
  };
}

// Dummy session type to replace Supabase Session
interface DummySession {
  access_token: string;
  user: DummyUser;
}

interface AuthContextType {
  user: DummyUser | null;
  session: DummySession | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  logActivity: (action: string, resourceType?: string, resourceId?: string, metadata?: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Dummy users database
const DUMMY_USERS = [
  {
    id: 'admin-123',
    email: 'richard@gmail.com',
    password: '123456789',
    full_name: 'Richard Admin',
    is_admin: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user-456',
    email: 'user@example.com',
    password: 'password123',
    full_name: 'John Doe',
    is_admin: false,
    created_at: '2024-01-01T00:00:00Z'
  }
];

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<DummyUser | null>(null);
  const [session, setSession] = useState<DummySession | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  // Check for existing session on mount
  useEffect(() => {
    const storedSession = localStorage.getItem('dummy_session');
    if (storedSession) {
      try {
        const parsedSession = JSON.parse(storedSession);
        setSession(parsedSession);
        setUser(parsedSession.user);
        setIsAdmin(parsedSession.user.email === 'richard@gmail.com');
      } catch (error) {
        console.error('Error parsing stored session:', error);
        localStorage.removeItem('dummy_session');
      }
    }
    setLoading(false);
  }, []);

  const logActivity = async (
    action: string, 
    resourceType?: string, 
    resourceId?: string, 
    metadata?: any
  ) => {
    // Dummy activity logging
    console.log('Activity logged:', { action, resourceType, resourceId, metadata, user: user?.email });
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      
      // Check if user already exists
      const existingUser = DUMMY_USERS.find(u => u.email === email);
      if (existingUser) {
        const error = { message: 'User already registered' };
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      // Create new dummy user
      const newUser = {
        id: `user-${Date.now()}`,
        email,
        password,
        full_name: fullName,
        is_admin: false,
        created_at: new Date().toISOString()
      };

      DUMMY_USERS.push(newUser);

      toast({
        title: "Account Created Successfully! 🎉",
        description: "You can now sign in with your credentials.",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Sign Up Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Find user in dummy database
      const foundUser = DUMMY_USERS.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        const error = { message: 'Invalid login credentials' };
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      // Create dummy session
      const dummyUser: DummyUser = {
        id: foundUser.id,
        email: foundUser.email,
        created_at: foundUser.created_at,
        user_metadata: {
          full_name: foundUser.full_name
        }
      };

      const dummySession: DummySession = {
        access_token: `dummy-token-${Date.now()}`,
        user: dummyUser
      };

      // Store session
      localStorage.setItem('dummy_session', JSON.stringify(dummySession));
      
      setSession(dummySession);
      setUser(dummyUser);
      setIsAdmin(foundUser.is_admin);

      await logActivity('login');

      toast({
        title: "Welcome Back! 🎉",
        description: "You have successfully signed in.",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Sign In Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await logActivity('logout');
      
      // Clear session
      localStorage.removeItem('dummy_session');
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    isAdmin,
    signUp,
    signIn,
    signOut,
    logActivity
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
