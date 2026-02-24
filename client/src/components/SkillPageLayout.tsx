import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface SkillPageLayoutProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  iconBgColor?: string;
  tagline?: string;
  skillName?: string;
  communityType?: string;
  communityLink?: string;
}

const SkillPageLayout = ({
  children,
  title,
  icon,
  iconBgColor = "bg-sky-500",
  tagline,
  skillName,
  communityType,
  communityLink,
}: SkillPageLayoutProps) => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <Link
          to="/"
          className="inline-flex items-center mb-8 text-maximally-black hover:text-maximally-blue font-space"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="gradient-bg rounded-xl p-8 mb-12 pixel-border glow-effect rainbow-border">
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-lg ${iconBgColor} transform hover:scale-110 transition-transform`}>
                {icon}
              </div>
              <h1 className="font-space font-bold text-3xl text-maximally-black bg-clip-text">
                {title}
              </h1>
            </div>
            <p className="font-space text-xl text-maximally-black/80 mb-8 leading-relaxed">
              {tagline}
            </p>
          </div>
          <div className="bg-white rounded-xl p-8">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SkillPageLayout;