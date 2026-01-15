import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Judges don't have accounts - they access via tokenized links
// This page is deprecated
export default function JudgeInbox() {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/');
  }, [navigate]);
  
  return null;
}
