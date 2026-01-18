import React from 'react';

const DocsSimple: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Documentation
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Everything you need to get up and running with Maximally.
            </p>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  Introduction to Maximally
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  Quick Start Guide
                </a>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Platform</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Core platform features and functionality.
            </p>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  Platform Overview
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  User Roles & Permissions
                </a>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Guides</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Step-by-step tutorials and how-tos.
            </p>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  Creating Your First Hackathon
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  Building Effective Teams
                </a>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">API Reference</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Complete API documentation and reference.
            </p>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  Authentication
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  API Endpoints
                </a>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Reference</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Reference materials and resources.
            </p>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  Glossary
                </a>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Support</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Get help and connect with the community.
            </p>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  Discord Community
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Can't find what you're looking for? We're here to help!
          </p>
          <div className="flex flex-wrap gap-4">
            <a 
              href="https://discord.gg/maximally" 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Join Discord
            </a>
            <a 
              href="/contact" 
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsSimple;