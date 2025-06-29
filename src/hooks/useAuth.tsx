
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const getDeviceInfo = () => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    return {
      userAgent,
      platform,
      language: navigator.language,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookieEnabled: navigator.cookieEnabled,
      onlineStatus: navigator.onLine
    };
  };

  const getLocationInfo = async () => {
    try {
      // Get IP-based location (you could use a service like ipapi.co)
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return {
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country_name,
        timezone: data.timezone
      };
    } catch (error) {
      console.log('Could not get location info:', error);
      return null;
    }
  };

  const logActivity = async (
    action: string, 
    resourceType?: string, 
    resourceId?: string, 
    metadata?: any
  ) => {
    if (!user) return;

    try {
      const deviceInfo = getDeviceInfo();
      const locationInfo = await getLocationInfo();

      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        device_info: deviceInfo,
        location_info: locationInfo,
        session_id: session?.access_token?.substring(0, 10) + '...',
        metadata,
        ip_address: locationInfo?.ip,
        user_agent: navigator.userAgent
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      console.log('Starting signup process for:', email);
      console.log('Redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName
          }
        }
      });

      console.log('Signup response:', { data, error });

      if (error) {
        console.error('Signup error:', error);
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log('Signup successful');
        toast({
          title: "Account Created Successfully!",
          description: "You can now sign in to access your dashboard.",
        });
      }

      return { error };
    } catch (error: any) {
      console.error('Signup catch error:', error);
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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
        
        // Log failed login attempt
        try {
          const deviceInfo = getDeviceInfo();
          const locationInfo = await getLocationInfo();
          
          await supabase.from('activity_logs').insert({
            user_id: null,
            action: 'login_failed',
            success: false,
            error_message: error.message,
            device_info: deviceInfo,
            location_info: locationInfo,
            ip_address: locationInfo?.ip,
            user_agent: navigator.userAgent,
            metadata: { email }
          });
        } catch (logError) {
          console.error('Failed to log failed login:', logError);
        }
      } else {
        toast({
          title: "Welcome Back!",
          description: "You have successfully signed in.",
        });
      }

      return { error };
    } catch (error: any) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await logActivity('logout');
      await supabase.auth.signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Log authentication events
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(async () => {
            const deviceInfo = getDeviceInfo();
            const locationInfo = await getLocationInfo();
            
            try {
              await supabase.from('activity_logs').insert({
                user_id: session.user.id,
                action: 'login',
                device_info: deviceInfo,
                location_info: locationInfo,
                session_id: session.access_token?.substring(0, 10) + '...',
                ip_address: locationInfo?.ip,
                user_agent: navigator.userAgent
              });
            } catch (error) {
              console.error('Failed to log login activity:', error);
            }
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    session,
    loading,
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
