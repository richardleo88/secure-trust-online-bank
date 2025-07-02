
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { mockAuth } from '@/services/mockAuthService';
import { mockDataService } from '@/services/mockDataService';
import { useToast } from '@/hooks/use-toast';

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

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = mockAuth.onAuthStateChange(
      (session) => {
        console.log('Auth state changed:', session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setIsAdmin(session?.user?.is_admin || false);
        setLoading(false);
      }
    );

    // Get initial session
    mockAuth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.is_admin || false);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logActivity = async (
    action: string, 
    resourceType?: string, 
    resourceId?: string, 
    metadata?: any
  ) => {
    if (!user) return;

    try {
      await mockDataService.logActivity({
        user_id: user.id,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        metadata
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await mockAuth.signIn(email, password);

      if (!error) {
        await logActivity('login');
      }

      return { error };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      const { error } = await mockAuth.signUp(email, password, fullName);
      return { error };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await logActivity('logout');
      await mockAuth.signOut();
      
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
    signIn,
    signUp,
    signOut,
    logActivity
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
