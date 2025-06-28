
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface ActivityLoggerProps {
  children: React.ReactNode;
}

const ActivityLogger = ({ children }: ActivityLoggerProps) => {
  const { logActivity, user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Log page navigation
    const logPageView = () => {
      logActivity('page_view', 'navigation', window.location.pathname, {
        url: window.location.href,
        referrer: document.referrer
      });
    };

    // Log page view on mount
    logPageView();

    // Log visibility changes (user switching tabs/windows)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logActivity('page_hidden', 'navigation', window.location.pathname);
      } else {
        logActivity('page_visible', 'navigation', window.location.pathname);
      }
    };

    // Log before page unload
    const handleBeforeUnload = () => {
      logActivity('page_unload', 'navigation', window.location.pathname);
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user, logActivity]);

  return <>{children}</>;
};

export default ActivityLogger;
