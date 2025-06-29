import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
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

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('Checking admin status for user:', userId);
      
      // First check profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin, email')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.error('Error checking profile admin status:', profileError);
      }
      
      // Also check admin_users table
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('admin_role, is_active')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle();
      
      if (adminError) {
        console.error('Error checking admin_users:', adminError);
      }
      
      const isAdminUser = profile?.is_admin || adminUser?.admin_role || profile?.email === 'richard@gmail.com';
      console.log('Admin status result:', { profileAdmin: profile?.is_admin, adminUser: adminUser?.admin_role, email: profile?.email, finalResult: isAdminUser });
      
      return Boolean(isAdminUser);
    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
      return false;
    }
  };

  const sendWelcomeEmail = async (userId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-welcome-email', {
        body: { userId }
      });

      if (error) {
        console.error('Error sending welcome email:', error);
      } else {
        console.log('Welcome email sent successfully');
      }
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }
  };

  const initializeUserSession = async (userId: string, isNewUser: boolean = false) => {
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

      // Check and set admin status
      const adminStatus = await checkAdminStatus(userId);
      setIsAdmin(adminStatus);

      // Send welcome email for new users
      if (isNewUser) {
        setTimeout(() => {
          sendWelcomeEmail(userId);
        }, 2000);
      }

      // Get user profile to check balance
      const { data: profile } = await supabase
        .from('profiles')
        .select('balance, email')
        .eq('id', userId)
        .single();

      // Set initial balance for new users
      if (isNewUser || profile?.balance === 0 || profile?.balance === null) {
        await supabase
          .from('profiles')
          .update({ balance: 5000.00 })
          .eq('id', userId);
      }

      // Special handling for admin user
      if (profile?.email === 'richard@gmail.com') {
        console.log('Setting up admin user richard@gmail.com');
        
        // Update profile to mark as admin
        await supabase
          .from('profiles')
          .update({ is_admin: true })
          .eq('id', userId);

        // Create admin user entry
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
          setIsAdmin(true);
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
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
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
          title: "Account Created Successfully! 🎉",
          description: "Please check your email for confirmation. You can now sign in with your credentials.",
        });
        
        // If user is immediately signed in (email confirmation disabled)
        if (data.user && data.session) {
          setTimeout(() => {
            initializeUserSession(data.user!.id, true);
          }, 1000);
        }
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
      console.log('Attempting sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
        
        // Log failed login attempt
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
        console.log('Sign in successful for user:', data.user?.id);
        
        // Check admin status after successful login
        if (data.user) {
          const adminStatus = await checkAdminStatus(data.user.id);
          console.log('Admin status for signed in user:', adminStatus);
          setIsAdmin(adminStatus);
          
          // Initialize session
          await initializeUserSession(data.user.id);
        }
        
        toast({
          title: "Welcome Back! 🎉",
          description: "You have successfully signed in.",
        });
      }

      return { error };
    } catch (error: any) {
      console.error('Sign in catch error:', error);
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
      
      // Deactivate current session
      if (user) {
        await supabase
          .from('user_sessions')
          .update({ is_active: false })
          .eq('user_id', user.id)
          .eq('is_active', true);
      }
      
      setIsAdmin(false);
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
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Log authentication events and initialize session
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in, initializing session...');
          
          setTimeout(async () => {
            const adminStatus = await checkAdminStatus(session.user.id);
            console.log('Setting admin status:', adminStatus);
            setIsAdmin(adminStatus);
            
            // Only initialize session if not already done
            if (event === 'SIGNED_IN') {
              await initializeUserSession(session.user.id);
            }
            
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
          }, 100);
        }

        if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setIsAdmin(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkAdminStatus(session.user.id).then((adminStatus) => {
          console.log('Initial admin status check:', adminStatus);
          setIsAdmin(adminStatus);
        });
      }
      
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

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
