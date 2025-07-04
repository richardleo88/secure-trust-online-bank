import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PageLoader = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    </div>
  );
};

export default PageLoader;