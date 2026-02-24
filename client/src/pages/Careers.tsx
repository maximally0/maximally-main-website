import { useEffect } from "react";
import { Briefcase, Mail, Users, Sparkles } from "lucide-react";
import Footer from "@/components/Footer";

const Careers = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.08)_0%,transparent_50%)]" />
      
      <div className="absolute top-20 left-[5%] w-80 h-80 bg-orange-500/5 rounded-full blur-[100px]" />
      <div className="absolute top-60 right-[10%] w-60 h-60 bg-orange-500/3 rounded-full blur-[80px]" />
      
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-gray-800 mb-6">
            <Briefcase className="w-4 h-4 text-orange-400" />
            <span className="font-space font-bold text-[10px] sm:text-xs text-orange-400">OPPORTUNITIES</span>
          </div>
          
          <h1 className="font-space font-bold text-xl sm:text-2xl md:text-3xl mb-6">
            <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
              JOIN THE TEAM
            </span>
          </h1>
          
          <p className="font-space text-gray-400 text-sm sm:text-base max-w-2xl mx-auto mb-12">
            Help us build the future of hackathons and empower the next generation of builders.
          </p>

          <div className="bg-gradient-to-br from-gray-900/40 via-black to-gray-900/20 border border-gray-800 p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.05)_0%,transparent_70%)]" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
            
            <div className="relative z-10">
              <div className="bg-orange-500/10 border border-orange-500/30 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-orange-400" />
              </div>
              
              <h2 className="font-space font-bold text-sm sm:text-base text-white mb-4">
                No Open Positions
              </h2>
              
              <p className="font-space text-gray-400 mb-6 max-w-lg mx-auto">
                We don't have any open positions at the moment, but we're always looking for talented people to join our team.
              </p>
              
              <div className="bg-gradient-to-br from-gray-900/40 to-gray-900/20 border border-gray-700 p-6 inline-block">
                <div className="flex items-center gap-3 justify-center">
                  <Mail className="h-5 w-5 text-gray-300" />
                  <span className="font-space text-gray-300">
                    Email us at <a href="mailto:hello@maximally.in" className="text-gray-300 hover:text-gray-300 transition-colors">hello@maximally.in</a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Careers;
