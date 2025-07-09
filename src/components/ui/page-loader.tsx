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

  const isHomepage = location.pathname === '/';
  const backgroundClass = isHomepage ? 'bg-white/45' : 'bg-black/80';
  const blurClass = isHomepage ? 'backdrop-blur-xl' : 'backdrop-blur-md';

  return (
    <div className={`fixed inset-0 ${backgroundClass} ${blurClass} z-50 flex items-center justify-center`} style={{ mixBlendMode: 'multiply' }}>
      <div className="relative">
        {/* Outer gradient ring */}
        <div className="w-32 h-32 rounded-full gradient-loader-ring animate-spin">
          <div className="absolute inset-2 bg-black rounded-full"></div>
        </div>
        
        {/* Inner gradient glow */}
        <div className="absolute inset-8 gradient-loader-center rounded-full blur-lg opacity-80"></div>
        <div className="absolute inset-10 gradient-loader-center rounded-full opacity-60"></div>
        
        {/* Dotted progress ring */}
        <div className="absolute inset-1 w-30 h-30 rounded-full border-2 border-dotted border-white/30 animate-pulse"></div>
      </div>
    </div>
  );
};

export default PageLoader;