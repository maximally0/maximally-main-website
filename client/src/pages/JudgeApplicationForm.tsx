import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Eye, Upload, Info, CheckCircle2 } from 'lucide-react';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import type { JudgeTier, ExpertiseArea } from '@/lib/judgesData';

const JudgeApplicationForm = () => {
  const [formSection, setFormSection] = useState<'public' | 'private'>('public');
  const [showPreview, setShowPreview] = useState(false);

  const expertiseAreas: ExpertiseArea[] = [
    'AI', 'Product', 'Systems', 'Education', 'Design', 'Backend',
    'Frontend', 'Mobile', 'DevOps', 'Security', 'Blockchain',
    'Data Science', 'Game Development', 'Hardware', 'IoT'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Application submitted! (Frontend-only demo - no actual submission)');
  };

  return (
    <>
      <SEO
        title="Apply to be a Judge | Maximally"
        description="Join the global network of elite judges at Maximally. Help evaluate the next generation of teen builders."
      />

      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Pixel Grid Background */}
        <div className="fixed inset-0 bg-black" />
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Floating Pixels */}
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="fixed w-2 h-2 bg-maximally-yellow pixel-border animate-float pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + i}s`,
            }}
          />
        ))}

        <main className="min-h-screen pt-24 pb-16 px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Back Button */}
            <Link
              to="/people/judges"
              className="minecraft-block bg-cyan-400 text-black px-4 py-2 hover:bg-maximally-yellow transition-colors mb-8 flex items-center gap-2 inline-flex"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-press-start text-xs">BACK TO JUDGES</span>
            </Link>

            {/* Hero Section */}
            <section className="text-center mb-12">
              <div className="minecraft-block bg-maximally-yellow text-black px-6 py-3 inline-block mb-8">
                <span className="font-press-start text-sm">⚡ JOIN THE ELITE</span>
              </div>
              <h1 className="font-press-start text-4xl md:text-6xl mb-8 minecraft-text">
                <span className="text-cyan-400 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  JUDGE APPLICATION
                </span>
              </h1>
              <p className="text-gray-300 text-lg md:text-xl font-jetbrains max-w-3xl mx-auto leading-relaxed mb-8">
                Become part of the global network of industry experts who shape the future of teen innovation.
              </p>

              {/* Info Box */}
              <div className="pixel-card bg-blue-900/30 border-2 border-blue-400 p-6 mb-8 max-w-3xl mx-auto">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-1" />
                  <div className="text-left">
                    <h3 className="font-press-start text-sm text-blue-400 mb-2">TIER PROGRESSION</h3>
                    <p className="font-jetbrains text-gray-300 text-sm leading-relaxed">
                      All judges start as <strong className="text-green-400">Starter Judges</strong>. As you judge more events and build your track record, you'll progress through 
                      <strong className="text-blue-400"> Verified</strong> → <strong className="text-purple-400">Senior</strong> → <strong className="text-yellow-400">Chief</strong> → <strong className="text-red-400">Legacy</strong> tiers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section Toggle */}
              <div className="flex justify-center gap-4 mb-8">
                <button
                  onClick={() => setFormSection('public')}
                  className={`minecraft-block px-6 py-3 transition-colors ${
                    formSection === 'public'
                      ? 'bg-cyan-400 text-black'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <span className="font-press-start text-xs">PUBLIC INFO</span>
                </button>
                <button
                  onClick={() => setFormSection('private')}
                  className={`minecraft-block px-6 py-3 transition-colors ${
                    formSection === 'private'
                      ? 'bg-cyan-400 text-black'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <span className="font-press-start text-xs">PRIVATE INFO</span>
                </button>
              </div>
            </section>

            {/* Application Form */}
            <section className="pixel-card bg-gray-900 border-2 border-cyan-400 p-8 mb-8">
              <form onSubmit={handleSubmit}>
                {/* PUBLIC INFO SECTION */}
                {formSection === 'public' && (
                  <div className="space-y-6">
                    <h2 className="font-press-start text-2xl mb-6 text-cyan-400">PUBLIC PROFILE</h2>
                    <p className="font-jetbrains text-gray-400 text-sm mb-6">This information will be visible on your public judge profile.</p>

                    {/* Full Name */}
                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">FULL NAME *</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Username */}
                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">USERNAME *</label>
                      <input
                        type="text"
                        required
                        placeholder="john-doe"
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors"
                      />
                      <p className="font-jetbrains text-gray-500 text-xs mt-1">This will be your profile URL: maximally.org/judges/your-username</p>
                    </div>

                    {/* Headline */}
                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">HEADLINE *</label>
                      <input
                        type="text"
                        required
                        placeholder="Senior Product Manager · AI Systems · Google"
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors"
                      />
                      <p className="font-jetbrains text-gray-500 text-xs mt-1">Keep it concise. Example: "Chief Judge · Blockchain · Ethereum Foundation"</p>
                    </div>

                    {/* Current Role & Company */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-press-start text-xs text-cyan-400 mb-2 block">CURRENT ROLE *</label>
                        <input
                          type="text"
                          required
                          placeholder="Senior Software Engineer"
                          className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="font-press-start text-xs text-cyan-400 mb-2 block">COMPANY *</label>
                        <input
                          type="text"
                          required
                          placeholder="Google"
                          className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">LOCATION *</label>
                      <input
                        type="text"
                        required
                        placeholder="San Francisco, USA"
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Short Bio */}
                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">SHORT BIO *</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Tell us about yourself, your experience, and why you want to judge hackathons..."
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    {/* Primary Expertise */}
                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">PRIMARY EXPERTISE * (Select 1-3)</label>
                      <div className="grid md:grid-cols-3 gap-2">
                        {expertiseAreas.slice(0, 9).map((area) => (
                          <label key={area} className="flex items-center gap-2 cursor-pointer pixel-card bg-gray-800 border border-gray-600 p-3 hover:border-cyan-400 transition-colors">
                            <input type="checkbox" className="w-4 h-4" />
                            <span className="font-jetbrains text-sm">{area}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Secondary Expertise */}
                    <div>
                      <label className="font-press-start text-xs text-gray-400 mb-2 block">SECONDARY EXPERTISE (Optional, select 1-3)</label>
                      <div className="grid md:grid-cols-3 gap-2">
                        {expertiseAreas.slice(9).map((area) => (
                          <label key={area} className="flex items-center gap-2 cursor-pointer pixel-card bg-gray-800 border border-gray-600 p-3 hover:border-gray-500 transition-colors">
                            <input type="checkbox" className="w-4 h-4" />
                            <span className="font-jetbrains text-sm text-gray-300">{area}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Years of Experience */}
                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">YEARS OF EXPERIENCE *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        max="50"
                        placeholder="5"
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors"
                      />
                    </div>

                    {/* LinkedIn */}
                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">LINKEDIN URL *</label>
                      <input
                        type="url"
                        required
                        placeholder="https://linkedin.com/in/yourusername"
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Other Links */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-press-start text-xs text-gray-400 mb-2 block">GITHUB (Optional)</label>
                        <input
                          type="url"
                          placeholder="https://github.com/yourusername"
                          className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-gray-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="font-press-start text-xs text-gray-400 mb-2 block">TWITTER (Optional)</label>
                        <input
                          type="url"
                          placeholder="https://twitter.com/yourusername"
                          className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-gray-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Website */}
                    <div>
                      <label className="font-press-start text-xs text-gray-400 mb-2 block">WEBSITE (Optional)</label>
                      <input
                        type="url"
                        placeholder="https://yourwebsite.com"
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-gray-500 focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Languages Spoken */}
                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">LANGUAGES SPOKEN *</label>
                      <input
                        type="text"
                        required
                        placeholder="English, Spanish, French"
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors"
                      />
                      <p className="font-jetbrains text-gray-500 text-xs mt-1">Separate multiple languages with commas</p>
                    </div>

                    {/* Public Achievements */}
                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">PUBLIC ACHIEVEMENTS *</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Notable awards, publications, talks, open-source contributions..."
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    {/* Mentorship Statement */}
                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">MENTORSHIP PHILOSOPHY *</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Share your philosophy on mentoring and evaluating young builders..."
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    {/* Profile Photo Upload */}
                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">PROFILE PHOTO *</label>
                      <div className="pixel-card bg-gray-800 border-2 border-dashed border-gray-600 p-8 text-center hover:border-cyan-400 transition-colors cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                        <p className="font-jetbrains text-gray-400 text-sm mb-1">Click to upload or drag and drop</p>
                        <p className="font-jetbrains text-gray-500 text-xs">JPG or PNG (max 5MB)</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* PRIVATE INFO SECTION */}
                {formSection === 'private' && (
                  <div className="space-y-6">
                    <h2 className="font-press-start text-2xl mb-6 text-cyan-400">PRIVATE INFORMATION</h2>
                    <p className="font-jetbrains text-gray-400 text-sm mb-6">This information is kept confidential and used only for verification and communication.</p>

                    {/* Email */}
                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">EMAIL ADDRESS *</label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">PHONE NUMBER *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 234 567 8900"
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Timezone */}
                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">TIMEZONE *</label>
                      <select
                        required
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors"
                      >
                        <option value="">Select timezone</option>
                        <option value="PST">PST - Pacific Standard Time</option>
                        <option value="EST">EST - Eastern Standard Time</option>
                        <option value="GMT">GMT - Greenwich Mean Time</option>
                        <option value="IST">IST - Indian Standard Time</option>
                        <option value="JST">JST - Japan Standard Time</option>
                      </select>
                    </div>

                    {/* Availability Status */}
                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">AVAILABILITY STATUS *</label>
                      <select
                        required
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors"
                      >
                        <option value="">Select availability</option>
                        <option value="available">Available - Ready to judge regularly</option>
                        <option value="seasonal">Seasonal - Available certain times of year</option>
                        <option value="not-available">Not Available - Profile only</option>
                      </select>
                    </div>

                    {/* Past Judging Experience */}
                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">PAST JUDGING EXPERIENCE</label>
                      <textarea
                        rows={4}
                        placeholder="List hackathons/events you've judged before (if any)..."
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-gray-500 focus:outline-none transition-colors resize-none"
                      />
                      <p className="font-jetbrains text-gray-500 text-xs mt-1">Optional - helps us verify your tier faster</p>
                    </div>

                    {/* Self-Declared Stats */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="font-press-start text-xs text-gray-400 mb-2 block">EVENTS JUDGED</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-gray-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="font-press-start text-xs text-gray-400 mb-2 block">TEAMS EVALUATED</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-gray-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="font-press-start text-xs text-gray-400 mb-2 block">MENTORSHIP HOURS</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-gray-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <p className="font-jetbrains text-gray-500 text-xs">These stats will be marked as "self-declared" until verified by Maximally</p>

                    {/* Resume Upload */}
                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">RESUME/CV *</label>
                      <div className="pixel-card bg-gray-800 border-2 border-dashed border-gray-600 p-8 text-center hover:border-cyan-400 transition-colors cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                        <p className="font-jetbrains text-gray-400 text-sm mb-1">Click to upload resume</p>
                        <p className="font-jetbrains text-gray-500 text-xs">PDF (max 10MB)</p>
                      </div>
                    </div>

                    {/* Proof Documents */}
                    <div>
                      <label className="font-press-start text-xs text-gray-400 mb-2 block">PROOF DOCUMENTS (Optional)</label>
                      <div className="pixel-card bg-gray-800 border-2 border-dashed border-gray-600 p-8 text-center hover:border-gray-500 transition-colors cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                        <p className="font-jetbrains text-gray-400 text-sm mb-1">Upload certificates, event links, references</p>
                        <p className="font-jetbrains text-gray-500 text-xs">PDFs, images, or links (max 20MB total)</p>
                      </div>
                      <p className="font-jetbrains text-gray-500 text-xs mt-2">Help us verify your stats faster by providing proof of past judging experience</p>
                    </div>

                    {/* How did you hear about us */}
                    <div>
                      <label className="font-press-start text-xs text-gray-400 mb-2 block">HOW DID YOU HEAR ABOUT MAXIMALLY?</label>
                      <textarea
                        rows={2}
                        placeholder="e.g., LinkedIn, friend referral, event..."
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-gray-500 focus:outline-none transition-colors resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-700">
                  {formSection === 'public' && (
                    <button
                      type="button"
                      onClick={() => setFormSection('private')}
                      className="minecraft-block bg-cyan-400 text-black px-6 py-3 hover:bg-cyan-300 transition-colors"
                    >
                      <span className="font-press-start text-xs">NEXT: PRIVATE INFO →</span>
                    </button>
                  )}
                  
                  {formSection === 'private' && (
                    <>
                      <button
                        type="button"
                        onClick={() => setFormSection('public')}
                        className="minecraft-block bg-gray-700 text-white px-6 py-3 hover:bg-gray-600 transition-colors"
                      >
                        <span className="font-press-start text-xs">← BACK: PUBLIC INFO</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setShowPreview(true)}
                        className="minecraft-block bg-purple-600 text-white px-6 py-3 hover:bg-purple-700 transition-colors flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="font-press-start text-xs">PREVIEW</span>
                      </button>
                      
                      <button
                        type="submit"
                        className="minecraft-block bg-maximally-red text-white px-6 py-3 hover:bg-maximally-yellow hover:text-black transition-colors flex items-center gap-2 ml-auto"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="font-press-start text-xs">SUBMIT APPLICATION</span>
                      </button>
                    </>
                  )}
                </div>
              </form>
            </section>

            {/* Info Section */}
            <section className="pixel-card bg-gray-900 border-2 border-maximally-yellow p-6 mb-8">
              <h3 className="font-press-start text-lg text-maximally-yellow mb-4">WHAT HAPPENS NEXT?</h3>
              <ol className="space-y-3 font-jetbrains text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="minecraft-block bg-cyan-400 text-black px-2 py-1 font-press-start text-xs">1</span>
                  <span>Our team reviews your application (usually within 3-5 business days)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="minecraft-block bg-cyan-400 text-black px-2 py-1 font-press-start text-xs">2</span>
                  <span>If approved, you'll be onboarded as a <strong className="text-green-400">Starter Judge</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="minecraft-block bg-cyan-400 text-black px-2 py-1 font-press-start text-xs">3</span>
                  <span>Your profile goes live on our public judges directory</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="minecraft-block bg-cyan-400 text-black px-2 py-1 font-press-start text-xs">4</span>
                  <span>We'll match you with hackathons based on your expertise and availability</span>
                </li>
              </ol>
            </section>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default JudgeApplicationForm;
