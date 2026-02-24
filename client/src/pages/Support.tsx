import { useEffect } from "react";
import { HelpCircle, Mail, MessageSquare, ExternalLink } from "lucide-react";
import Footer from "@/components/Footer";

const Support = () => {
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
      
      <div className="pt-24 px-4 pb-12 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-gray-800 mb-6">
            <HelpCircle className="w-4 h-4 text-orange-400" />
            <span className="font-space font-bold text-[10px] sm:text-xs text-orange-400">HELP CENTER</span>
          </div>
          
          <h1 className="font-space font-bold text-xl sm:text-2xl md:text-3xl mb-6">
            <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
              SUPPORT
            </span>
          </h1>
          
          <div className="max-w-2xl">
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 p-6 mb-8">
              <h2 className="font-space font-bold text-sm text-orange-400 mb-4">How Can We Help?</h2>
              <p className="font-space text-gray-400 leading-relaxed">
                We're here to help you with any questions or issues you might have about Maximally's programs and services.
              </p>
            </div>
            
            <div className="grid gap-5">
              <a 
                href="mailto:support@maximally.in"
                className="group bg-gradient-to-br from-gray-900/40 to-gray-900/20 border border-gray-700 p-6 hover:border-gray-600/60 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-gray-800 border border-gray-700 w-12 h-12 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-gray-300" />
                  </div>
                  <div>
                    <h3 className="font-space font-bold text-xs text-gray-300 mb-1">EMAIL US</h3>
                    <p className="font-space text-gray-400 text-sm">support@maximally.in</p>
                  </div>
                </div>
              </a>
              
              <a 
                href="https://discord.gg/MpBnYk8qMX"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/30 p-6 hover:border-indigo-400/60 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-500/20 border border-indigo-500/40 w-12 h-12 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-space font-bold text-xs text-indigo-300 mb-1">JOIN DISCORD</h3>
                    <p className="font-space text-gray-400 text-sm">Get help from our community</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-indigo-400" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Support;
