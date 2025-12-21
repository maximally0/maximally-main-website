import { ArrowLeft, CheckCircle2, Brain, MessagesSquare, Lightbulb, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const ThankYou = () => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.10)_0%,transparent_50%)]" />
      
      <div className="absolute top-20 left-[5%] w-80 h-80 bg-purple-500/15 rounded-full blur-[100px]" />
      <div className="absolute top-60 right-[10%] w-60 h-60 bg-pink-500/12 rounded-full blur-[80px]" />
      <div className="absolute bottom-40 left-[20%] w-72 h-72 bg-green-500/10 rounded-full blur-[90px]" />
      
      <main className="container mx-auto px-4 pt-24 pb-16 text-center relative z-10">
        <div className="max-w-2xl mx-auto space-y-12">
          {/* Thank You Message */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 p-8 backdrop-blur-sm">
              <div className="bg-green-500/20 border border-green-500/40 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              </div>
              <h1 className="font-press-start text-xl sm:text-2xl md:text-3xl mb-4">
                <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Thank you for applying!
                </span>
              </h1>
              <p className="font-jetbrains text-base sm:text-lg text-gray-300">
                We've received your application and our team will review it thoroughly.
              </p>
            </div>
            
            <p className="font-jetbrains text-base sm:text-lg text-gray-400">
              Please keep an eye on your email — all important updates and interview invites will be sent there.
            </p>
          </div>

          {/* Interview Tips */}
          <div className="grid gap-4 md:grid-cols-2 text-left">
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-cyan-500/20 border border-cyan-500/40 w-8 h-8 flex items-center justify-center">
                  <Brain className="h-4 w-4 text-cyan-400" />
                </div>
                <h3 className="font-press-start text-xs text-cyan-300">Be Authentic</h3>
              </div>
              <p className="font-jetbrains text-sm text-gray-400">
                We're looking for passion, not perfection
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/30 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-pink-500/20 border border-pink-500/40 w-8 h-8 flex items-center justify-center">
                  <Lightbulb className="h-4 w-4 text-pink-400" />
                </div>
                <h3 className="font-press-start text-xs text-pink-300">Brush Up Basics</h3>
              </div>
              <p className="font-jetbrains text-sm text-gray-400">
                Know what you wrote in your form
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-500/20 border border-green-500/40 w-8 h-8 flex items-center justify-center">
                  <MessagesSquare className="h-4 w-4 text-green-400" />
                </div>
                <h3 className="font-press-start text-xs text-green-300">Keep it Chill</h3>
              </div>
              <p className="font-jetbrains text-sm text-gray-400">
                It's a conversation, not a test
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/30 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-500/20 border border-purple-500/40 w-8 h-8 flex items-center justify-center">
                  <HelpCircle className="h-4 w-4 text-purple-400" />
                </div>
                <h3 className="font-press-start text-xs text-purple-300">Bring Questions</h3>
              </div>
              <p className="font-jetbrains text-sm text-gray-400">
                We love curious minds
              </p>
            </div>
          </div>

          {/* Navigation Button */}
          <div className="pt-8">
            <Link 
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600/40 to-pink-500/30 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white font-press-start text-xs transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Homepage
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ThankYou;
