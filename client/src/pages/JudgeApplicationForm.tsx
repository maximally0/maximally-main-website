import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Info, Loader2, Plus, X } from 'lucide-react';
import { z } from 'zod';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import { insertJudgeSchema } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { ExpertiseArea } from '@/lib/judgesData';

type JudgeFormData = z.infer<typeof insertJudgeSchema>;

interface JudgeEvent {
  eventName: string;
  role: string;
  date: string;
  link?: string;
}

const JudgeApplicationForm = () => {
  const navigate = useNavigate();
  const [formSection, setFormSection] = useState<'public' | 'private'>('public');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [topEventsJudged, setTopEventsJudged] = useState<JudgeEvent[]>([]);
  const [languagesInput, setLanguagesInput] = useState('');
  const { toast } = useToast();

  const expertiseAreas: ExpertiseArea[] = [
    'AI', 'Product', 'Systems', 'Education', 'Design', 'Backend',
    'Frontend', 'Mobile', 'DevOps', 'Security', 'Blockchain',
    'Data Science', 'Game Development', 'Hardware', 'IoT'
  ];

  const form = useForm<JudgeFormData>({
    resolver: zodResolver(insertJudgeSchema),
    defaultValues: {
      username: '',
      fullName: '',
      profilePhoto: '',
      headline: '',
      shortBio: '',
      location: '',
      currentRole: '',
      company: '',
      primaryExpertise: [],
      secondaryExpertise: [],
      totalEventsJudged: 0,
      totalTeamsEvaluated: 0,
      totalMentorshipHours: 0,
      yearsOfExperience: 0,
      linkedin: '',
      github: '',
      twitter: '',
      website: '',
      languagesSpoken: [],
      publicAchievements: '',
      mentorshipStatement: '',
      availabilityStatus: 'available',
      email: '',
      phone: '',
      timezone: '',
      compensationPreference: 'volunteer',
      agreedToNDA: false,
    },
  });

  const addEvent = () => {
    setTopEventsJudged([...topEventsJudged, { eventName: '', role: '', date: '', link: '' }]);
  };

  const removeEvent = (index: number) => {
    setTopEventsJudged(topEventsJudged.filter((_, i) => i !== index));
  };

  const updateEvent = (index: number, field: keyof JudgeEvent, value: string) => {
    const updated = [...topEventsJudged];
    updated[index] = { ...updated[index], [field]: value };
    setTopEventsJudged(updated);
  };

  const onSubmit = async (data: JudgeFormData) => {
    try {
      setIsSubmitting(true);

      const submitData = {
        ...data,
        topEventsJudged: topEventsJudged.filter(event => 
          event.eventName && event.role && event.date
        ),
      };

      await apiRequest('/api/judges/apply', {
        method: 'POST',
        body: JSON.stringify(submitData),
      });

      toast({
        title: 'Application Submitted!',
        description: 'Your judge application has been received. We\'ll review it and get back to you soon.',
      });

      setTimeout(() => {
        navigate('/people/judges');
      }, 2000);
    } catch (error: any) {
      toast({
        title: 'Submission Failed',
        description: error.message || 'There was an error submitting your application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Apply to be a Judge | Maximally"
        description="Join the global network of elite judges at Maximally. Help evaluate the next generation of teen builders."
      />

      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <div className="fixed inset-0 bg-black" />
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
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
            <Link
              to="/people/judges"
              className="minecraft-block bg-cyan-400 text-black px-4 py-2 hover:bg-maximally-yellow transition-colors mb-8 flex items-center gap-2 inline-flex"
              data-testid="link-back-to-judges"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-press-start text-xs">BACK TO JUDGES</span>
            </Link>

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

              <div className="flex justify-center gap-4 mb-8">
                <button
                  type="button"
                  onClick={() => setFormSection('public')}
                  className={`minecraft-block px-6 py-3 transition-colors ${
                    formSection === 'public'
                      ? 'bg-cyan-400 text-black'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  data-testid="button-toggle-public"
                >
                  <span className="font-press-start text-xs">PUBLIC INFO</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormSection('private')}
                  className={`minecraft-block px-6 py-3 transition-colors ${
                    formSection === 'private'
                      ? 'bg-cyan-400 text-black'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  data-testid="button-toggle-private"
                >
                  <span className="font-press-start text-xs">PRIVATE INFO</span>
                </button>
              </div>
            </section>

            <section className="pixel-card bg-gray-900 border-2 border-cyan-400 p-8 mb-8">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {formSection === 'public' && (
                  <div className="space-y-6">
                    <h2 className="font-press-start text-2xl mb-6 text-cyan-400">PUBLIC PROFILE</h2>
                    <p className="font-jetbrains text-gray-400 text-sm mb-6">This information will be visible on your public judge profile.</p>

                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">FULL NAME *</label>
                      <input
                        {...form.register('fullName')}
                        type="text"
                        placeholder="John Doe"
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors"
                        data-testid="input-full-name"
                      />
                      {form.formState.errors.fullName && (
                        <p className="font-jetbrains text-red-400 text-xs mt-1">{form.formState.errors.fullName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">USERNAME *</label>
                      <input
                        {...form.register('username')}
                        type="text"
                        placeholder="john-doe"
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors"
                        data-testid="input-username"
                      />
                      <p className="font-jetbrains text-gray-500 text-xs mt-1">This will be your profile URL: maximally.org/judges/your-username</p>
                      {form.formState.errors.username && (
                        <p className="font-jetbrains text-red-400 text-xs mt-1">{form.formState.errors.username.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">HEADLINE *</label>
                      <input
                        {...form.register('headline')}
                        type="text"
                        placeholder="Senior Product Manager · AI Systems · Google"
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors"
                        data-testid="input-headline"
                      />
                      <p className="font-jetbrains text-gray-500 text-xs mt-1">Keep it concise. Example: "Chief Judge · Blockchain · Ethereum Foundation"</p>
                      {form.formState.errors.headline && (
                        <p className="font-jetbrains text-red-400 text-xs mt-1">{form.formState.errors.headline.message}</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-press-start text-xs text-cyan-400 mb-2 block">CURRENT ROLE *</label>
                        <input
                          {...form.register('currentRole')}
                          type="text"
                          placeholder="Senior Software Engineer"
                          className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors"
                          data-testid="input-current-role"
                        />
                        {form.formState.errors.currentRole && (
                          <p className="font-jetbrains text-red-400 text-xs mt-1">{form.formState.errors.currentRole.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="font-press-start text-xs text-cyan-400 mb-2 block">COMPANY *</label>
                        <input
                          {...form.register('company')}
                          type="text"
                          placeholder="Google"
                          className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors"
                          data-testid="input-company"
                        />
                        {form.formState.errors.company && (
                          <p className="font-jetbrains text-red-400 text-xs mt-1">{form.formState.errors.company.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">LOCATION *</label>
                      <input
                        {...form.register('location')}
                        type="text"
                        placeholder="San Francisco, USA"
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors"
                        data-testid="input-location"
                      />
                      {form.formState.errors.location && (
                        <p className="font-jetbrains text-red-400 text-xs mt-1">{form.formState.errors.location.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">SHORT BIO *</label>
                      <textarea
                        {...form.register('shortBio')}
                        rows={4}
                        placeholder="Tell us about yourself, your experience, and why you want to judge hackathons..."
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                        data-testid="textarea-short-bio"
                      />
                      {form.formState.errors.shortBio && (
                        <p className="font-jetbrains text-red-400 text-xs mt-1">{form.formState.errors.shortBio.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">PRIMARY EXPERTISE * (Select 1-3)</label>
                      <div className="grid md:grid-cols-3 gap-2">
                        {expertiseAreas.slice(0, 9).map((area) => (
                          <label key={area} className="flex items-center gap-2 cursor-pointer pixel-card bg-gray-800 border border-gray-600 p-3 hover:border-cyan-400 transition-colors">
                            <input
                              type="checkbox"
                              value={area}
                              {...form.register('primaryExpertise')}
                              className="w-4 h-4"
                              data-testid={`checkbox-primary-${area.toLowerCase().replace(/\s+/g, '-')}`}
                            />
                            <span className="font-jetbrains text-sm">{area}</span>
                          </label>
                        ))}
                      </div>
                      {form.formState.errors.primaryExpertise && (
                        <p className="font-jetbrains text-red-400 text-xs mt-1">{form.formState.errors.primaryExpertise.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="font-press-start text-xs text-gray-400 mb-2 block">SECONDARY EXPERTISE (Optional, select 1-3)</label>
                      <div className="grid md:grid-cols-3 gap-2">
                        {expertiseAreas.slice(9).map((area) => (
                          <label key={area} className="flex items-center gap-2 cursor-pointer pixel-card bg-gray-800 border border-gray-600 p-3 hover:border-gray-500 transition-colors">
                            <input
                              type="checkbox"
                              value={area}
                              {...form.register('secondaryExpertise')}
                              className="w-4 h-4"
                              data-testid={`checkbox-secondary-${area.toLowerCase().replace(/\s+/g, '-')}`}
                            />
                            <span className="font-jetbrains text-sm text-gray-300">{area}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">YEARS OF EXPERIENCE *</label>
                      <input
                        {...form.register('yearsOfExperience', { valueAsNumber: true })}
                        type="number"
                        min="0"
                        max="50"
                        placeholder="5"
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors"
                        data-testid="input-years-of-experience"
                      />
                      {form.formState.errors.yearsOfExperience && (
                        <p className="font-jetbrains text-red-400 text-xs mt-1">{form.formState.errors.yearsOfExperience.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">LINKEDIN URL *</label>
                      <input
                        {...form.register('linkedin')}
                        type="url"
                        placeholder="https://linkedin.com/in/yourusername"
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors"
                        data-testid="input-linkedin"
                      />
                      {form.formState.errors.linkedin && (
                        <p className="font-jetbrains text-red-400 text-xs mt-1">{form.formState.errors.linkedin.message}</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-press-start text-xs text-gray-400 mb-2 block">GITHUB (Optional)</label>
                        <input
                          {...form.register('github')}
                          type="url"
                          placeholder="https://github.com/yourusername"
                          className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-gray-500 focus:outline-none transition-colors"
                          data-testid="input-github"
                        />
                      </div>
                      <div>
                        <label className="font-press-start text-xs text-gray-400 mb-2 block">TWITTER (Optional)</label>
                        <input
                          {...form.register('twitter')}
                          type="url"
                          placeholder="https://twitter.com/yourusername"
                          className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-gray-500 focus:outline-none transition-colors"
                          data-testid="input-twitter"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-press-start text-xs text-gray-400 mb-2 block">WEBSITE (Optional)</label>
                      <input
                        {...form.register('website')}
                        type="url"
                        placeholder="https://yourwebsite.com"
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-gray-500 focus:outline-none transition-colors"
                        data-testid="input-website"
                      />
                    </div>

                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">LANGUAGES SPOKEN *</label>
                      <input
                        type="text"
                        value={languagesInput}
                        onChange={(e) => {
                          const value = e.target.value;
                          setLanguagesInput(value);
                          const languagesArray = value
                            ? value.split(',').map(lang => lang.trim()).filter(Boolean)
                            : [];
                          form.setValue('languagesSpoken', languagesArray, { shouldValidate: true });
                        }}
                        placeholder="English, Spanish, French"
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors"
                        data-testid="input-languages-spoken"
                      />
                      <p className="font-jetbrains text-gray-500 text-xs mt-1">Separate multiple languages with commas</p>
                      {form.formState.errors.languagesSpoken && (
                        <p className="font-jetbrains text-red-400 text-xs mt-1">{form.formState.errors.languagesSpoken.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">PUBLIC ACHIEVEMENTS *</label>
                      <textarea
                        {...form.register('publicAchievements')}
                        rows={3}
                        placeholder="Notable awards, publications, talks, open-source contributions..."
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                        data-testid="textarea-public-achievements"
                      />
                      {form.formState.errors.publicAchievements && (
                        <p className="font-jetbrains text-red-400 text-xs mt-1">{form.formState.errors.publicAchievements.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">MENTORSHIP PHILOSOPHY *</label>
                      <textarea
                        {...form.register('mentorshipStatement')}
                        rows={3}
                        placeholder="Share your philosophy on mentoring and evaluating young builders..."
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                        data-testid="textarea-mentorship-statement"
                      />
                      {form.formState.errors.mentorshipStatement && (
                        <p className="font-jetbrains text-red-400 text-xs mt-1">{form.formState.errors.mentorshipStatement.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">TOP EVENTS JUDGED (Optional)</label>
                      <div className="space-y-4">
                        {topEventsJudged.map((event, index) => (
                          <div key={index} className="pixel-card bg-gray-800 border border-gray-600 p-4">
                            <div className="flex justify-between items-center mb-3">
                              <span className="font-press-start text-xs text-cyan-400">EVENT {index + 1}</span>
                              <button
                                type="button"
                                onClick={() => removeEvent(index)}
                                className="text-red-400 hover:text-red-300"
                                data-testid={`button-remove-event-${index}`}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-3">
                              <input
                                type="text"
                                placeholder="Event Name"
                                value={event.eventName}
                                onChange={(e) => updateEvent(index, 'eventName', e.target.value)}
                                className="pixel-card bg-gray-900 border border-gray-600 text-white px-3 py-2 font-jetbrains text-sm focus:border-cyan-400 focus:outline-none"
                                data-testid={`input-event-name-${index}`}
                              />
                              <input
                                type="text"
                                placeholder="Your Role"
                                value={event.role}
                                onChange={(e) => updateEvent(index, 'role', e.target.value)}
                                className="pixel-card bg-gray-900 border border-gray-600 text-white px-3 py-2 font-jetbrains text-sm focus:border-cyan-400 focus:outline-none"
                                data-testid={`input-event-role-${index}`}
                              />
                              <input
                                type="text"
                                placeholder="Date (e.g., March 2024)"
                                value={event.date}
                                onChange={(e) => updateEvent(index, 'date', e.target.value)}
                                className="pixel-card bg-gray-900 border border-gray-600 text-white px-3 py-2 font-jetbrains text-sm focus:border-cyan-400 focus:outline-none"
                                data-testid={`input-event-date-${index}`}
                              />
                              <input
                                type="url"
                                placeholder="Link (optional)"
                                value={event.link || ''}
                                onChange={(e) => updateEvent(index, 'link', e.target.value)}
                                className="pixel-card bg-gray-900 border border-gray-600 text-white px-3 py-2 font-jetbrains text-sm focus:border-cyan-400 focus:outline-none"
                                data-testid={`input-event-link-${index}`}
                              />
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addEvent}
                          className="minecraft-block bg-gray-700 text-white px-4 py-2 hover:bg-gray-600 transition-colors flex items-center gap-2"
                          data-testid="button-add-event"
                        >
                          <Plus className="h-4 w-4" />
                          <span className="font-press-start text-xs">ADD EVENT</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {formSection === 'private' && (
                  <div className="space-y-6">
                    <h2 className="font-press-start text-2xl mb-6 text-cyan-400">PRIVATE INFORMATION</h2>
                    <p className="font-jetbrains text-gray-400 text-sm mb-6">This information is kept confidential and used only for verification and communication.</p>

                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">EMAIL ADDRESS *</label>
                      <input
                        {...form.register('email')}
                        type="email"
                        placeholder="john@example.com"
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors"
                        data-testid="input-email"
                      />
                      {form.formState.errors.email && (
                        <p className="font-jetbrains text-red-400 text-xs mt-1">{form.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">PHONE NUMBER</label>
                      <input
                        {...form.register('phone')}
                        type="tel"
                        placeholder="+1 234 567 8900"
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors"
                        data-testid="input-phone"
                      />
                    </div>

                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">TIMEZONE</label>
                      <input
                        {...form.register('timezone')}
                        type="text"
                        placeholder="America/New_York or PST"
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors"
                        data-testid="input-timezone"
                      />
                    </div>

                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">AVAILABILITY STATUS *</label>
                      <select
                        {...form.register('availabilityStatus')}
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors"
                        data-testid="select-availability-status"
                      >
                        <option value="available">Available - Ready to judge regularly</option>
                        <option value="seasonal">Seasonal - Available certain times of year</option>
                        <option value="not-available">Not Available - Profile only</option>
                      </select>
                      {form.formState.errors.availabilityStatus && (
                        <p className="font-jetbrains text-red-400 text-xs mt-1">{form.formState.errors.availabilityStatus.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="font-press-start text-xs text-cyan-400 mb-2 block">COMPENSATION PREFERENCE</label>
                      <select
                        {...form.register('compensationPreference')}
                        className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-cyan-400 focus:outline-none transition-colors"
                        data-testid="select-compensation-preference"
                      >
                        <option value="volunteer">Volunteer - I judge for free</option>
                        <option value="paid">Paid - I require compensation</option>
                        <option value="negotiable">Negotiable - Depends on the event</option>
                      </select>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="font-press-start text-xs text-gray-400 mb-2 block">EVENTS JUDGED</label>
                        <input
                          {...form.register('totalEventsJudged', { valueAsNumber: true })}
                          type="number"
                          min="0"
                          placeholder="0"
                          className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-gray-500 focus:outline-none transition-colors"
                          data-testid="input-total-events-judged"
                        />
                      </div>
                      <div>
                        <label className="font-press-start text-xs text-gray-400 mb-2 block">TEAMS EVALUATED</label>
                        <input
                          {...form.register('totalTeamsEvaluated', { valueAsNumber: true })}
                          type="number"
                          min="0"
                          placeholder="0"
                          className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-gray-500 focus:outline-none transition-colors"
                          data-testid="input-total-teams-evaluated"
                        />
                      </div>
                      <div>
                        <label className="font-press-start text-xs text-gray-400 mb-2 block">MENTORSHIP HOURS</label>
                        <input
                          {...form.register('totalMentorshipHours', { valueAsNumber: true })}
                          type="number"
                          min="0"
                          placeholder="0"
                          className="w-full pixel-card bg-gray-800 border-2 border-gray-600 text-white px-4 py-3 font-jetbrains focus:border-gray-500 focus:outline-none transition-colors"
                          data-testid="input-total-mentorship-hours"
                        />
                      </div>
                    </div>
                    <p className="font-jetbrains text-gray-500 text-xs">These stats will be marked as "self-declared" until verified by Maximally</p>

                    <div className="pixel-card bg-blue-900/20 border border-blue-400 p-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          {...form.register('agreedToNDA')}
                          type="checkbox"
                          className="w-5 h-5 mt-1"
                          data-testid="checkbox-agreed-to-nda"
                        />
                        <div className="flex-1">
                          <span className="font-press-start text-xs text-blue-400 block mb-1">AGREEMENT *</span>
                          <p className="font-jetbrains text-gray-300 text-sm">
                            I agree to maintain confidentiality and follow Maximally's judging guidelines and code of conduct.
                          </p>
                        </div>
                      </label>
                      {form.formState.errors.agreedToNDA && (
                        <p className="font-jetbrains text-red-400 text-xs mt-2">{form.formState.errors.agreedToNDA.message}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-8 flex gap-4">
                  {formSection === 'public' && (
                    <button
                      type="button"
                      onClick={() => setFormSection('private')}
                      className="minecraft-block bg-gray-700 text-white px-6 py-3 hover:bg-gray-600 transition-colors flex-1"
                      data-testid="button-next-to-private"
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
                        data-testid="button-back-to-public"
                      >
                        <span className="font-press-start text-xs">← BACK</span>
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="minecraft-block bg-maximally-yellow text-black px-6 py-3 hover:bg-yellow-400 transition-colors flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        data-testid="button-submit-application"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="font-press-start text-xs">SUBMITTING...</span>
                          </>
                        ) : (
                          <span className="font-press-start text-xs">SUBMIT APPLICATION</span>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </form>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default JudgeApplicationForm;
