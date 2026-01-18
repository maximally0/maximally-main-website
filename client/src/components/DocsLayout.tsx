import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, ChevronDown, FileText, Folder, Search, Menu, X, Book, Code, Users, Zap, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DocFile {
  path: string;
  title: string;
  description?: string;
  category: string;
  order: number;
  content?: string;
}

interface DocCategory {
  name: string;
  displayName: string;
  description: string;
  icon: React.ReactNode;
  files: DocFile[];
  expanded: boolean;
}