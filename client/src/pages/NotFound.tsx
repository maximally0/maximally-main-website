import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  useEffect(() => {
    document.title = "404 - Page Not Found | Maximally";
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'Sorry, the page you are looking for does not exist. Return to Maximally homepage.');
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(249,115,22,0.04)_0%,transparent_50%)]" />
      
      <div className="absolute top-20 left-[10%] w-80 h-80 bg-orange-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-[10%] w-60 h-60 bg-orange-500/3 rounded-full blur-[80px]" />

      <main className="relative z-10 text-center px-4 py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-orange-500/10 border border-orange-500/30">
          <AlertTriangle className="w-10 h-10 text-orange-400" />
        </div>
        
        <h1 className="font-space font-bold text-4xl sm:text-5xl md:text-6xl mb-6">
          <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
            404
          </span>
        </h1>
        
        <p className="font-space font-bold text-sm sm:text-base text-gray-400 mb-4">
          PAGE NOT FOUND
        </p>
        
        <p className="font-space text-base sm:text-lg text-gray-500 max-w-md mx-auto mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link to="/">
          <Button className="bg-gradient-to-r from-orange-600 to-orange-500 border border-orange-500/50 hover:border-orange-500 text-white hover:text-white font-space font-bold text-xs px-8 py-5 transition-all duration-300 inline-flex items-center gap-2">
            <Home className="w-4 h-4" />
            RETURN HOME
          </Button>
        </Link>
      </main>
    </div>
  );
};

export default NotFound;
