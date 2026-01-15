import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Scale, Send, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getAuthHeaders } from '@/lib/auth';

interface RequestToJudgeProps {
  hackathonId: number;
}

export default function RequestToJudge({ hackathonId }: RequestToJudgeProps) {
  // Judges don't have accounts - they access via tokenized links
  // This component is deprecated
  return null;
}
