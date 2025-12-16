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
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_50%)]" />
      
      <div className="absolute top-20 left-[5%] w-80 h-80 bg-purple-500/15 rounded-full blur-[100px]" />
      <div className="absolute top-60 right-[10%] w-60 h-60 bg-pink-500/12 rounded-full blur-[80px]" />
      
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 mb-6">
            <Briefcase className="w-4 h-4 text-purple-400" />
            <span className="font-press-start text-[10px] sm:text-xs text-purple-300">OPPORTUNITIES</span>
          </div>
          
          <h1 className="font-press-start text-xl sm:text-2xl md:text-3xl mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              JOIN THE TEAM
            </span>
          </h1>
          
          <p className="font-jetbrains text-gray-400 text-sm sm:text-base max-w-2xl mx-auto mb-12">
            Help us build the future of hackathons and empower the next generation of builders.
          </p>

          <div className="bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20 border border-purple-500/30 p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.1)_0%,transparent_70%)]" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            
            <div className="relative z-10">
              <div className="bg-purple-500/20 border border-purple-500/40 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-purple-400" />
              </div>
              
              <h2 className="font-press-start text-sm sm:text-base text-white mb-4">
                No Open Positions
              </h2>
              
              <p className="font-jetbrains text-gray-400 mb-6 max-w-lg mx-auto">
                We don't have any open positions at the moment, but we're always looking for talented people to join our team.
              </p>
              
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 p-6 inline-block">
                <div className="flex items-center gap-3 justify-center">
                  <Mail className="h-5 w-5 text-cyan-400" />
                  <span className="font-jetbrains text-gray-300">
                    Email us at <a href="mailto:hello@maximally.in" className="text-cyan-400 hover:text-cyan-300 transition-colors">hello@maximally.in</a>
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
