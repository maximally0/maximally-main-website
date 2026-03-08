import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Mic, Users, Newspaper } from "lucide-react";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";

const contentTypes = [
  {
    icon: BookOpen,
    title: "Blog",
    description: "Articles on building, organizing events, and the builder ecosystem.",
    url: "/blog",
    cta: "Read the Blog",
    available: true,
  },
  {
    icon: Mic,
    title: "Podcasts",
    description: "Conversations with builders, organizers, and operators in the ecosystem.",
    url: "#",
    cta: "Coming Soon",
    available: false,
  },
  {
    icon: Users,
    title: "Builder Stories",
    description: "Profiles and interviews with builders who shipped through Maximally events.",
    url: "#",
    cta: "Coming Soon",
    available: false,
  },
  {
    icon: Newspaper,
    title: "Ecosystem Updates",
    description: "News, announcements, and updates from across the Maximally ecosystem.",
    url: "#",
    cta: "Coming Soon",
    available: false,
  },
];

export default function Resources() {
  return (
    <>
      <SEO
        title="Resources — Blog, Podcasts & Builder Stories | Maximally"
        description="Knowledge from the builder ecosystem. Blog articles, podcasts, builder stories, and updates from the Maximally infrastructure community."
        canonicalUrl="https://maximally.in/resources"
      />
      <div className="min-h-screen bg-black text-white pt-20 sm:pt-24 relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10 pb-20">
          <div className="max-w-3xl mx-auto text-center pt-12 sm:pt-16 mb-20">
            <span className="font-space text-sm text-orange-400 tracking-[0.2em] font-medium mb-4 block uppercase">Resources</span>
            <h1 className="font-space text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Knowledge from<br />the ecosystem
            </h1>
            <p className="font-space text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Articles, stories, and media from builders, organizers, and operators.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {contentTypes.map((item, i) => {
              const Wrapper = item.available ? Link : 'div';
              const wrapperProps = item.available ? { to: item.url } : {};
              return (
                <Wrapper
                  key={i}
                  {...(wrapperProps as any)}
                  className={`group p-7 sm:p-8 bg-gray-900/40 border border-gray-800 transition-all duration-300 ${
                    item.available ? 'hover:border-orange-500/40 cursor-pointer' : 'opacity-70'
                  }`}
                >
                  <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 inline-block mb-5 group-hover:bg-orange-500/20 transition-colors">
                    <item.icon className="w-5 h-5 text-orange-400" />
                  </div>
                  <h3 className="font-space text-lg font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-space text-sm text-gray-400 mb-5 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 font-space text-sm font-medium text-orange-400">
                    <span>{item.cta}</span>
                    {item.available && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  </div>
                </Wrapper>
              );
            })}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
