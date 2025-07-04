import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PageLoader = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        {/* Animated Logo/Spinner */}
        <div className="relative">
          {/* Outer Ring */}
          <div className="w-20 h-20 border-4 border-primary/20 rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-primary rounded-full animate-pulse"></div>
          </div>
          
          {/* Inner Ring */}
          <div className="absolute inset-2 w-16 h-16 border-4 border-secondary/30 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-b-secondary rounded-full"></div>
          </div>
          
          {/* Center Dot */}
          <div className="absolute inset-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-primary rounded-full animate-pulse"></div>
        </div>
        
        {/* Loading Text */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-1">
            <span className="text-lg font-semibold text-foreground">Loading</span>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Please wait while we prepare your page</p>
        </div>
        
        {/* Progress Bar */}
        <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full loading-progress">
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;