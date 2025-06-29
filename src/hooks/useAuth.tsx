
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
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return {
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country_name,
        country_code: data.country_code,
        timezone: data.timezone
      };
    } catch (error) {
      console.log('Could not get location info:', error);
      return null;
    }
  };

  const initializeUserSession = async (userId: string) => {
    try {
      const deviceInfo = getDeviceInfo();
      const locationInfo = await getLocationInfo();

      // Create user session
      const sessionData = {
        user_id: userId,
        session_token: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        device_name: `${navigator.platform} - ${navigator.userAgent.match(/(Chrome|Firefox|Safari|Edge)/)?.[0] || 'Unknown'}`,
        device_type: /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        browser: navigator.userAgent.match(/(Chrome|Firefox|Safari|Edge)/)?.[0] || 'Unknown',
        os: navigator.platform,
        ip_address: locationInfo?.ip,
        location: locationInfo ? {
          city: locationInfo.city,
          region: locationInfo.region,
          country: locationInfo.country,
          country_code: locationInfo.country_code,
          timezone: locationInfo.timezone
        } : null
      };

      await supabase.from('user_sessions').insert(sessionData);

      // Set initial balance to 5000 for new users
      const { data: profile } = await supabase
        .from('profiles')
        .select('balance, email')
        .eq('id', userId)
        .single();

      if (profile?.balance === 0 || profile?.balance === null) {
        await supabase
          .from('profiles')
          .update({ balance: 5000.00 })
          .eq('id', userId);
      }

      // Check if this is the admin user and create admin entry
      if (profile?.email === 'Richard@gmail.com') {
        const { error: adminError } = await supabase
          .from('admin_users')
          .upsert({
            user_id: userId,
            admin_role: 'super_admin',
            is_active: true
          });

        if (adminError) {
          console.error('Error creating admin user:', adminError);
        } else {
          console.log('Admin user created successfully');
        }
      }
    } catch (error) {
      console.error('Error initializing user session:', error);
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
      
      console.log('Starting signup process for:', email);
      console.log('Full name provided:', fullName);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
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
        
        // Log failed login attempt (simplified to avoid RLS issues)
        try {
          const deviceInfo = getDeviceInfo();
          const locationInfo = await getLocationInfo();
          
          console.log('Failed login attempt:', {
            email,
            error: error.message,
            device: deviceInfo,
            location: locationInfo
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
      console.error('Sign in error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await logActivity('logout');
      
      // Deactivate current session
      if (user) {
        await supabase
          .from('user_sessions')
          .update({ is_active: false })
          .eq('user_id', user.id)
          .eq('is_active', true);
      }
      
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

        // Log authentication events and initialize session
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(async () => {
            await initializeUserSession(session.user.id);
            
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
