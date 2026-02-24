import { useState } from 'react';
import { cn } from '@/lib/utils';

interface PactItem {
  icon: string;
  title: string;
  description: string;
}

const whatWeOffer: PactItem[] = [
  {
    icon: '🎖',
    title: 'Powered by Maximally Badge',
    description: 'Official partnership recognition'
  },
  {
    icon: '🎟',
    title: 'Free Passes + Judge Slots',
    description: 'Premium access & expert judges'
  },
  {
    icon: '💰',
    title: '₹1K–₹15K Event Funding',
    description: 'Direct financial support'
  },
  {
    icon: '🎬',
    title: 'Content Support',
    description: 'Professional marketing assets'
  }
];

const whatYouOffer: PactItem[] = [
  {
    icon: '📢',
    title: 'Co-promote Maximally Drops',
    description: 'Share our latest announcements'
  },
  {
    icon: '⭐',
    title: 'Nominate Top Builders',
    description: 'Refer exceptional talent'
  },
  {
    icon: '🎯',
    title: 'Host 1 Challenge per Event',
    description: 'Include Maximally challenges'
  },
  {
    icon: '🤝',
    title: 'Refer 2 Orgs to Network',
    description: 'Expand the collective'
  }
];

export default function MutualPactSection() {
  const [activeTab, setActiveTab] = useState<'offer' | 'need'>('offer');

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 to-black text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 font-mono tracking-wider">
          MUTUAL PACT
        </h2>
        <p className="text-center text-gray-400 mb-8">
          A fair exchange for mutual growth
        </p>

        {/* Mobile Tab Selector */}
        <div className="md:hidden mb-6">
          <div className="flex bg-gray-800 rounded-lg p-1 max-w-md mx-auto">
            <button
              onClick={() => setActiveTab('offer')}
              className={cn(
                "flex-1 py-3 px-4 rounded-md font-mono text-sm transition-all duration-300",
                activeTab === 'offer'
                  ? "bg-red-500 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              )}
            >
              WHAT WE OFFER
            </button>
            <button
              onClick={() => setActiveTab('need')}
              className={cn(
                "flex-1 py-3 px-4 rounded-md font-mono text-sm transition-all duration-300",
                activeTab === 'need'
                  ? "bg-yellow-500 text-black shadow-lg"
                  : "text-gray-400 hover:text-white"
              )}
            >
              WHAT YOU OFFER
            </button>
          </div>
        </div>

        {/* Desktop Side-by-Side Layout */}
        <div className="hidden md:grid md:grid-cols-2 gap-8">
          {/* What We Offer Column */}
          <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-6 border-2 border-red-400">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-red-300 rounded-full"></div>
              <h3 className="text-xl font-bold font-mono tracking-wider">
                WHAT WE OFFER
              </h3>
            </div>
            <div className="space-y-4">
              {whatWeOffer.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-black/20 rounded-lg hover:bg-black/30 transition-all duration-300 hover:scale-105"
                >
                  <div className="text-2xl flex-shrink-0">{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                    <p className="text-red-100 text-xs">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What You Offer Column */}
          <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl p-6 border-2 border-yellow-400">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-yellow-300 rounded-full"></div>
              <h3 className="text-xl font-bold font-mono tracking-wider text-black">
                WHAT YOU OFFER
              </h3>
            </div>
            <div className="space-y-4">
              {whatYouOffer.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-black/20 rounded-lg hover:bg-black/30 transition-all duration-300 hover:scale-105"
                >
                  <div className="text-2xl flex-shrink-0">{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-sm mb-1 text-black">{item.title}</h4>
                    <p className="text-yellow-100 text-xs">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Swipeable Content */}
        <div className="md:hidden">
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(${activeTab === 'offer' ? '0%' : '-100%'})`
              }}
            >
              {/* What We Offer Mobile */}
              <div className="w-full flex-shrink-0">
                <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-6 border-2 border-red-400">
                  <div className="space-y-4">
                    {whatWeOffer.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 bg-black/20 rounded-lg"
                      >
                        <div className="text-2xl flex-shrink-0">{item.icon}</div>
                        <div>
                          <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                          <p className="text-red-100 text-xs">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* What You Offer Mobile */}
              <div className="w-full flex-shrink-0">
                <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl p-6 border-2 border-yellow-400 ml-4">
                  <div className="space-y-4">
                    {whatYouOffer.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 bg-black/20 rounded-lg"
                      >
                        <div className="text-2xl flex-shrink-0">{item.icon}</div>
                        <div>
                          <h4 className="font-bold text-sm mb-1 text-black">{item.title}</h4>
                          <p className="text-yellow-100 text-xs">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="inline-block bg-gradient-to-r from-red-500 to-yellow-500 p-1 rounded-xl">
            <div className="bg-black rounded-lg px-8 py-4">
              <p className="text-lg font-mono mb-3">
                Ready to join the collective?
              </p>
              <button className="bg-gradient-to-r from-red-500 to-yellow-500 text-black font-bold py-3 px-8 rounded-lg hover:scale-105 transition-transform duration-300">
                START PARTNERSHIP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}