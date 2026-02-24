import { useEffect } from 'react';

const CommunityRedirect = () => {
  useEffect(() => {
    window.location.href = 'https://discord.gg/MpBnYk8qMX';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-maximally-black text-white">
      <div className="text-center">
        <h1 className="font-space font-bold text-2xl mb-4">Redirecting to Discord...</h1>
        <p className="font-space">If you are not redirected automatically, 
          <a href="https://discord.gg/MpBnYk8qMX" className="text-maximally-red ml-1">click here</a>
        </p>
      </div>
    </div>
  );
};

export default CommunityRedirect;