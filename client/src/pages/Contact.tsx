import {
  Mail,
  Phone,
  Instagram,
  Terminal,
  MessageCircle,
  Users,
  Briefcase,
  Newspaper,
  HelpCircle,
  Linkedin,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.10)_0%,transparent_50%)]" />
      
      <div className="absolute top-20 left-[5%] w-80 h-80 bg-purple-500/15 rounded-full blur-[100px]" />
      <div className="absolute top-40 right-[10%] w-60 h-60 bg-pink-500/12 rounded-full blur-[80px]" />
      <div className="absolute bottom-40 left-[20%] w-72 h-72 bg-cyan-500/10 rounded-full blur-[90px]" />

      <div className="container mx-auto px-4 sm:px-6 py-20 sm:py-28 relative z-10">
        {/* Back Link */}
        <Link 
          to="/"
          className="group inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 font-jetbrains text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-purple-500/10 border border-purple-500/30">
            <Mail className="w-4 h-4 text-purple-400" />
            <span className="font-press-start text-[10px] sm:text-xs text-purple-300 tracking-wider">
              GET IN TOUCH
            </span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          
          <h1 className="font-press-start text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Contact Us
            </span>
          </h1>
          
          <p className="font-jetbrains text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Ready to join the hackathon revolution? Have questions? 
            Want to partner with us? We're here to help build the future together.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16">
          {/* Phone Numbers Section */}
          <section>
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-400" />
                <h2 className="font-press-start text-xs sm:text-sm text-purple-400">DIRECT CONTACTS</h2>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-purple-500/40 to-transparent" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
              {[
                { name: "Rishul Chanana", phone: "+91 90412 60790", email: "rishul@maximally.in" },
                { name: "Drishti Arora", phone: "-", email: "drishti@maximally.in" },
              ].map((contact, index) => (
                <div
                  key={index}
                  className="p-6 bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 hover:translate-y-[-2px]"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-purple-400" />
                    </div>
                    <h3 className="font-press-start text-xs sm:text-sm mb-3 text-purple-300">
                      {contact.name.toUpperCase()}
                    </h3>
                    <a
                      href={`tel:${contact.phone.replaceAll(" ", "")}`}
                      className="font-jetbrains text-white hover:text-purple-400 transition-colors text-base sm:text-lg block mb-2"
                    >
                      {contact.phone}
                    </a>
                    <a
                      href={`mailto:${contact.email}`}
                      className="font-jetbrains text-gray-400 hover:text-pink-400 transition-colors text-sm block"
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>


          {/* Email Section */}
          <section>
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-pink-400" />
                <h2 className="font-press-start text-xs sm:text-sm text-pink-400">EMAIL SUPPORT</h2>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-pink-500/40 to-transparent" />
            </div>
            
            <p className="font-jetbrains text-sm text-gray-400 mb-6 text-center max-w-2xl mx-auto">
              All emails are redirected to our central inbox. Depending on the topic, 
              you'll receive replies from the relevant Maximally team member.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {[
                { type: "General Inquiries", email: "hello@maximally.in", icon: Mail, color: "purple" },
                { type: "Partnerships", email: "partners@maximally.in", icon: Briefcase, color: "green" },
                { type: "Judging & Mentorship", email: "judges@maximally.in", icon: Users, color: "cyan" },
                { type: "Press & Media", email: "press@maximally.in", icon: Newspaper, color: "pink" },
                { type: "Support", email: "support@maximally.in", icon: HelpCircle, color: "amber" },
              ].map((contact, index) => {
                const colorClasses: Record<string, { border: string; bg: string; text: string }> = {
                  purple: { border: "border-purple-500/30 hover:border-purple-400/60", bg: "bg-purple-500/20 border-purple-500/40", text: "text-purple-400" },
                  green: { border: "border-green-500/30 hover:border-green-400/60", bg: "bg-green-500/20 border-green-500/40", text: "text-green-400" },
                  cyan: { border: "border-cyan-500/30 hover:border-cyan-400/60", bg: "bg-cyan-500/20 border-cyan-500/40", text: "text-cyan-400" },
                  pink: { border: "border-pink-500/30 hover:border-pink-400/60", bg: "bg-pink-500/20 border-pink-500/40", text: "text-pink-400" },
                  amber: { border: "border-amber-500/30 hover:border-amber-400/60", bg: "bg-amber-500/20 border-amber-500/40", text: "text-amber-400" },
                };
                const colors = colorClasses[contact.color];
                
                return (
                  <div
                    key={index}
                    className={`p-6 bg-gradient-to-br from-gray-900/60 to-gray-900/30 border ${colors.border} transition-all duration-300 hover:translate-y-[-2px]`}
                  >
                    <div className={`w-12 h-12 mx-auto mb-4 ${colors.bg} border flex items-center justify-center`}>
                      <contact.icon className={`h-5 w-5 ${colors.text}`} />
                    </div>
                    <h3 className={`font-press-start text-[10px] sm:text-xs mb-3 ${colors.text} text-center`}>
                      {contact.type.toUpperCase()}
                    </h3>
                    <a
                      href={`mailto:${contact.email}`}
                      className="font-jetbrains text-gray-300 hover:text-white transition-colors text-sm block text-center"
                    >
                      {contact.email}
                    </a>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Official Channels Section */}
          <section>
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h2 className="font-press-start text-xs sm:text-sm text-cyan-400">OFFICIAL CHANNELS</h2>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/40 to-transparent" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {[
                { name: "Instagram", url: "https://instagram.com/maximally.in", handle: "@maximally.in", icon: Instagram, color: "pink" },
                { name: "LinkedIn", url: "https://linkedin.com/company/maximallyedu", handle: "Maximally", icon: Linkedin, color: "blue" },
                { name: "Discord", url: "https://discord.gg/MpBnYk8qMX", handle: "Join Community", icon: MessageCircle, color: "indigo" },
                { name: "Website", url: "https://maximally.in", handle: "maximally.in", icon: Terminal, color: "purple" },
              ].map((channel, index) => {
                const colorClasses: Record<string, { border: string; bg: string; text: string }> = {
                  pink: { border: "border-pink-500/30 hover:border-pink-400/60", bg: "bg-pink-500/20 border-pink-500/40", text: "text-pink-400" },
                  blue: { border: "border-blue-500/30 hover:border-blue-400/60", bg: "bg-blue-500/20 border-blue-500/40", text: "text-blue-400" },
                  indigo: { border: "border-indigo-500/30 hover:border-indigo-400/60", bg: "bg-indigo-500/20 border-indigo-500/40", text: "text-indigo-400" },
                  purple: { border: "border-purple-500/30 hover:border-purple-400/60", bg: "bg-purple-500/20 border-purple-500/40", text: "text-purple-400" },
                };
                const colors = colorClasses[channel.color];
                
                return (
                  <a
                    key={index}
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-6 bg-gradient-to-br from-gray-900/60 to-gray-900/30 border ${colors.border} transition-all duration-300 hover:translate-y-[-2px] block`}
                  >
                    <div className={`w-12 h-12 mx-auto mb-4 ${colors.bg} border flex items-center justify-center`}>
                      <channel.icon className={`h-5 w-5 ${colors.text}`} />
                    </div>
                    <h3 className={`font-press-start text-[10px] sm:text-xs mb-2 ${colors.text} text-center`}>
                      {channel.name.toUpperCase()}
                    </h3>
                    <p className="font-jetbrains text-gray-300 text-sm text-center">
                      {channel.handle}
                    </p>
                  </a>
                );
              })}
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
