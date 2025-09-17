
import { Mail, Phone, Instagram, Terminal, MessageCircle, Users, Briefcase, Newspaper, HelpCircle, Linkedin } from "lucide-react";
import { useEffect } from "react";
import Footer from "@/components/Footer";

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Pixel Grid Background */}
      <div className="fixed inset-0 bg-black" />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      {/* Floating Pixels */}
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className="fixed w-2 h-2 bg-maximally-red pixel-border animate-float pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${4 + i}s`,
          }}
        />
      ))}
      
      <div className="container mx-auto px-4 py-24 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="minecraft-block bg-maximally-red text-black px-6 py-3 inline-block mb-8">
            <span className="font-press-start text-sm">📬 GET IN TOUCH</span>
          </div>
          <h1 className="font-press-start text-4xl md:text-6xl lg:text-7xl mb-8 minecraft-text">
            <span className="text-maximally-red drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              CONTACT US
            </span>
          </h1>
          <p className="text-gray-300 text-lg font-jetbrains max-w-3xl mx-auto leading-relaxed mb-12">
            Ready to join the hackathon revolution? Have questions? Want to partner with us? We're here to help build the future together.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-12">
          {/* Phone Numbers Section */}
          <section>
            <div className="text-center mb-8">
              <div className="minecraft-block bg-maximally-red text-black px-6 py-3 inline-block mb-6">
                <span className="font-press-start text-sm">📞 GET IN TOUCH</span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  name: "Rishul Chanana",
                  phone: "+91 90412 60790",
                  email: "rishul@maximally.in"
                },
                {
                  name: "Drishti Arora",
                  phone: "+91 88375 12713",
                  email: "drishti@maximally.in"
                }
              ].map((contact, index) => (
                <div key={index} className="pixel-card bg-black border-2 border-maximally-red p-6 hover:scale-105 transition-all duration-300 hover:border-maximally-yellow">
                  <div className="text-center">
                    <div className="minecraft-block bg-maximally-red w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                      <Phone className="h-6 w-6 text-black" />
                    </div>
                    <h3 className="font-press-start text-sm mb-2 text-maximally-red">
                      {contact.name.toUpperCase()}
                    </h3>
                    <a href={`tel:${contact.phone.replaceAll(' ', '')}`} className="font-jetbrains text-white hover:text-maximally-red transition-colors text-lg block mb-2">
                      {contact.phone}
                    </a>
                    <a href={`mailto:${contact.email}`} className="font-jetbrains text-gray-300 hover:text-maximally-yellow transition-colors text-sm block">
                      {contact.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Email Section */}
          <section>
            <div className="text-center mb-8">
              <div className="minecraft-block bg-maximally-yellow text-black px-6 py-3 inline-block mb-6">
                <span className="font-press-start text-sm">📧 EMAIL SUPPORT</span>
              </div>
              <h2 className="font-press-start text-2xl md:text-3xl mb-4 text-maximally-yellow">
                SPECIALIZED CONTACTS
              </h2>
              <p className="font-jetbrains text-gray-300 max-w-3xl mx-auto">
                All emails are redirected to our central inbox. Depending on the topic, you'll receive replies from the relevant Maximally team member or agent.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { 
                  type: "General Inquiries", 
                  email: "hello@maximally.in", 
                  icon: Mail, 
                  color: "maximally-yellow",
                  bgColor: "bg-maximally-yellow"
                },
                { 
                  type: "Partnerships", 
                  email: "partners@maximally.in", 
                  icon: Briefcase, 
                  color: "green-400",
                  bgColor: "bg-green-500"
                },
                { 
                  type: "Judging & Mentorship", 
                  email: "judges@maximally.in", 
                  icon: Users, 
                  color: "blue-400",
                  bgColor: "bg-blue-500"
                },
                { 
                  type: "Press & Media", 
                  email: "press@maximally.in", 
                  icon: Newspaper, 
                  color: "purple-400",
                  bgColor: "bg-purple-500"
                },
                { 
                  type: "Support", 
                  email: "support@maximally.in", 
                  icon: HelpCircle, 
                  color: "maximally-red",
                  bgColor: "bg-maximally-red"
                }
              ].map((contact, index) => (
                <div key={index} className={`pixel-card bg-black border-2 border-${contact.color} p-6 hover:scale-105 transition-all duration-300 hover:border-maximally-yellow`}>
                  <div className={`minecraft-block ${contact.bgColor} w-12 h-12 mx-auto mb-4 flex items-center justify-center`}>
                    <contact.icon className="h-6 w-6 text-black" />
                  </div>
                  <h3 className={`font-press-start text-xs mb-3 text-${contact.color} text-center`}>
                    {contact.type.toUpperCase()}
                  </h3>
                  <a 
                    href={`mailto:${contact.email}`} 
                    className={`font-jetbrains text-white hover:text-${contact.color} transition-colors text-sm block text-center`}
                  >
                    {contact.email}
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Official Channels Section */}
          <section>
            <div className="text-center mb-8">
              <div className="minecraft-block bg-cyan-400 text-black px-6 py-3 inline-block mb-6">
                <span className="font-press-start text-sm">🌐 OFFICIAL CHANNELS</span>
              </div>
              <h2 className="font-press-start text-2xl md:text-3xl mb-4 text-cyan-400">
                FIND US ONLINE
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: "Instagram",
                  url: "https://instagram.com/maximally.in",
                  handle: "@maximally.in",
                  icon: Instagram,
                  color: "pink-500"
                },
                {
                  name: "LinkedIn", 
                  url: "https://linkedin.com/company/maximallyedu",
                  handle: "Maximally",
                  icon: Linkedin,
                  color: "blue-600"
                },
                {
                  name: "Discord",
                  url: "https://discord.gg/MpBnYk8qMX",
                  handle: "Join Community",
                  icon: MessageCircle,
                  color: "indigo-500"
                },
                {
                  name: "Website",
                  url: "https://maximally.in",
                  handle: "maximally.in",
                  icon: Terminal,
                  color: "maximally-red"
                }
              ].map((channel, index) => (
                <div key={index} className={`pixel-card bg-black border-2 border-${channel.color} p-6 hover:scale-105 transition-all duration-300 hover:border-maximally-yellow`}>
                  <div className={`minecraft-block bg-${channel.color} w-12 h-12 mx-auto mb-4 flex items-center justify-center`}>
                    <channel.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className={`font-press-start text-xs mb-2 text-${channel.color} text-center`}>
                    {channel.name.toUpperCase()}
                  </h3>
                  <a 
                    href={channel.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`font-jetbrains text-white hover:text-${channel.color} transition-colors text-sm block text-center`}
                  >
                    {channel.handle}
                  </a>
                </div>
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
