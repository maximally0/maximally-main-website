import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, TrendingUp, Code, Layers } from 'lucide-react';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import DomainAnalytics from '@/components/DomainAnalytics';

export default function PlatformAnalytics() {
  return (
    <>
      <SEO
        title="Platform Analytics - Maximally"
        description="Explore technology trends and insights across the Maximally hackathon platform"
        keywords="hackathon analytics, technology trends, developer insights"
      />

      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="pt-20 sm:pt-28 pb-12 sm:pb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.10)_0%,transparent_50%)]" />
          
          <div className="absolute top-20 left-[5%] w-80 h-80 bg-purple-500/15 rounded-full blur-[100px]" />
          <div className="absolute top-40 right-[10%] w-60 h-60 bg-pink-500/12 rounded-full blur-[80px]" />
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <Link 
              to="/"
              className="group inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 font-jetbrains text-sm mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-purple-500/10 border border-purple-500/30">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                <span className="font-press-start text-[10px] sm:text-xs text-purple-300 tracking-wider">
                  PLATFORM ANALYTICS
                </span>
                <TrendingUp className="w-4 h-4 text-purple-400" />
              </div>

              <h1 className="font-press-start text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 leading-tight">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                  Tech Trends
                </span>
              </h1>

              <p className="font-jetbrains text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Discover what technologies are trending across hackathons. 
                See what builders are using and where the industry is heading.
              </p>
            </div>
          </div>
        </section>

        {/* Analytics Content */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <DomainAnalytics showPlatformTrends={true} />
            </div>
          </div>
        </section>

        {/* Info Cards */}
        <section className="py-12 sm:py-16 border-t border-purple-500/20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-800 p-6">
                <div className="p-3 bg-blue-500/20 border border-blue-500/40 w-fit mb-4">
                  <Code className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="font-press-start text-xs text-white mb-2">TECH STACK</h3>
                <p className="font-jetbrains text-sm text-gray-400">
                  See which technologies are most popular among hackathon participants
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-800 p-6">
                <div className="p-3 bg-green-500/20 border border-green-500/40 w-fit mb-4">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="font-press-start text-xs text-white mb-2">TRENDS</h3>
                <p className="font-jetbrains text-sm text-gray-400">
                  Track rising and declining technologies over the past 90 days
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-gray-800 p-6">
                <div className="p-3 bg-purple-500/20 border border-purple-500/40 w-fit mb-4">
                  <Layers className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="font-press-start text-xs text-white mb-2">DOMAINS</h3>
                <p className="font-jetbrains text-sm text-gray-400">
                  Explore different technology domains from Frontend to AI/ML
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
