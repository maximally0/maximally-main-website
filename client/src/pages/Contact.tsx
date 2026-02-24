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
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.08)_0%,transparent_50%)]" />
      
      <div className="absolute top-20 left-[5%] w-80 h-80 bg-orange-500/5 rounded-full blur-[100px]" />
      <div className="absolute top-40 right-[10%] w-60 h-60 bg-orange-500/3 rounded-full blur-[80px]" />

      <div className="container mx-auto px-4 sm:px-6 py-20 sm:py-28 relative z-10">
        {/* Back Link */}
        <Link 
          to="/"
          className="group inline-flex items-center gap-2 text-gray-400 hover:text-orange-400 font-space text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-orange-500/10 border border-orange-500/30">
            <Mail className="w-4 h-4 text-orange-400" />
            <span className="font-space font-semibold text-[10px] sm:text-xs text-orange-400 tracking-wider">
              GET IN TOUCH
            </span>
          </div>
          
          <h1 className="font-space font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 leading-tight">
            <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
              Contact Us
            </span>
          </h1>
          
          <p className="font-space text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Ready to join the hackathon revolution? Have questions? 
            Want to partner with us? We're here to help build the future together.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16">
          {/* Phone Numbers Section */}
          <section>
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-400" />
                <h2 className="font-space font-bold text-xs sm:text-sm text-orange-400">DIRECT CONTACTS</h2>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-orange-500/40 to-transparent" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
              {[
                { name: "Rishul Chanana", phone: "+91 90412 60790", email: "rishul@maximally.org" }
              ].map((contact, index) => (
                <div
                  key={index}
                  className="p-6 bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-800 hover:border-orange-500/50 transition-all duration-300 hover:translate-y-[-2px]"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-orange-400" />
                    </div>
                    <h3 className="font-space font-bold text-xs sm:text-sm mb-3 text-orange-400">
                      {contact.name.toUpperCase()}
                    </h3>
                    <a
                      href={`tel:${contact.phone.replaceAll(" ", "")}`}
                      className="font-space text-white hover:text-orange-400 transition-colors text-base sm:text-lg block mb-2"
                    >
                      {contact.phone}
                    </a>
                    <a
                      href={`mailto:${contact.email}`}
                      className="font-space text-gray-400 hover:text-orange-400 transition-colors text-sm block"
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
                <Mail className="w-4 h-4 text-orange-400" />
                <h2 className="font-space font-bold text-xs sm:text-sm text-orange-400">EMAIL SUPPORT</h2>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-orange-500/40 to-transparent" />
            </div>
            
            <p className="font-space text-sm text-gray-400 mb-6 text-center max-w-2xl mx-auto">
              All emails are redirected to our central inbox. Depending on the topic, 
              you'll receive replies from the relevant Maximally team member.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {[
                { type: "General Inquiries", email: "hello@maximally.org", icon: Mail },
                { type: "Partnerships", email: "partners@maximally.org", icon: Briefcase },
                { type: "Judging & Mentorship", email: "judges@maximally.org", icon: Users },
                { type: "Press & Media", email: "press@maximally.org", icon: Newspaper },
                { type: "Support", email: "support@maximally.org", icon: HelpCircle },
              ].map((contact, index) => (
                <div
                  key={index}
                  className="p-6 bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-800 hover:border-orange-500/50 transition-all duration-300 hover:translate-y-[-2px]"
                >
                  <div className="w-12 h-12 mx-auto mb-4 bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
                    <contact.icon className="h-5 w-5 text-orange-400" />
                  </div>
                  <h3 className="font-space font-bold text-[10px] sm:text-xs mb-3 text-orange-400 text-center">
                    {contact.type.toUpperCase()}
                  </h3>
                  <a
                    href={`mailto:${contact.email}`}
                    className="font-space text-gray-300 hover:text-white transition-colors text-sm block text-center"
                  >
                    {contact.email}
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Official Channels Section */}
          <section>
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-orange-400" />
                <h2 className="font-space font-bold text-xs sm:text-sm text-orange-400">OFFICIAL CHANNELS</h2>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-orange-500/40 to-transparent" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {[
                { name: "Instagram", url: "https://instagram.com/maximallyhq", handle: "@maximallyhq", icon: Instagram },
                { name: "LinkedIn", url: "https://linkedin.com/company/maximallyedu", handle: "Maximally", icon: Linkedin },
                { name: "Discord", url: "https://discord.gg/MpBnYk8qMX", handle: "Join Community", icon: MessageCircle },
                { name: "Website", url: "https://maximally.in", handle: "maximally.in", icon: Terminal },
              ].map((channel, index) => (
                <a
                  key={index}
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-6 bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-800 hover:border-orange-500/50 transition-all duration-300 hover:translate-y-[-2px] block"
                >
                  <div className="w-12 h-12 mx-auto mb-4 bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
                    <channel.icon className="h-5 w-5 text-orange-400" />
                  </div>
                  <h3 className="font-space font-bold text-[10px] sm:text-xs mb-2 text-orange-400 text-center">
                    {channel.name.toUpperCase()}
                  </h3>
                  <p className="font-space text-gray-300 text-sm text-center">
                    {channel.handle}
                  </p>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
