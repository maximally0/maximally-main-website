import React from 'react';
import DocsRenderer from '@/components/DocsRenderer';
import { Helmet } from 'react-helmet-async';

const Docs: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Documentation - Maximally</title>
        <meta 
          name="description" 
          content="Comprehensive documentation for the Maximally platform. Learn how to organize hackathons, participate in events, and use all platform features." 
        />
        <meta 
          name="keywords" 
          content="maximally documentation, hackathon platform guide, API documentation, user guide" 
        />
        <link rel="canonical" href="https://maximally.in/docs" />
      </Helmet>
      
      <DocsRenderer />
    </>
  );
};

export default Docs;