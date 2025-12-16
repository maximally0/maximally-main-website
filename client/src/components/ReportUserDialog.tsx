import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Flag, Upload, X, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';

interface ReportUserDialogProps {
  reportedUserId: string;
  reportedUsername: string;
  trigger?: React.ReactNode;
}

const REPORT_CATEGORIES = [
  { value: 'harassment', label: 'Harassment or Bullying', description: 'Threatening, intimidating, or targeting behavior' },
  { value: 'spam', label: 'Spam', description: 'Unsolicited messages or promotional content' },
  { value: 'inappropriate_content', label: 'Inappropriate Content', description: 'Offensive or explicit content' },
  { value: 'impersonation', label: 'Impersonation', description: 'Pretending to be someone else' },
  { value: 'cheating', label: 'Cheating', description: 'Unfair practices in hackathons or competitions' },
  { value: 'hate_speech', label: 'Hate Speech', description: 'Discriminatory or hateful content' },
  { value: 'scam', label: 'Scam or Fraud', description: 'Deceptive practices or fraud attempts' },
  { value: 'other', label: 'Other', description: 'Other violations not listed above' },
];

export default function ReportUserDialog({ reportedUserId, reportedUsername, trigger }: ReportUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { isBanned, isMuted } = useAuth();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (screenshots.length >= 3) {
      toast({ title: 'Maximum 3 screenshots allowed', variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      for (const file of Array.from(files).slice(0, 3 - screenshots.length)) {
        if (file.size > 5 * 1024 * 1024) {
          toast({ title: 'File too large', description: 'Max 5MB per file', variant: 'destructive' });
          continue;
        }

        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('report-screenshots')
          .upload(fileName, file);

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from('report-screenshots')
          .getPublicUrl(fileName);

        setScreenshots(prev => [...prev, urlData.publicUrl]);
      }
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const removeScreenshot = (index: number) => {
    setScreenshots(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Check if user is banned or muted
    if (isBanned || isMuted) {
      toast({ 
        title: 'Action Blocked', 
        description: 'Your account is restricted. You cannot submit reports.', 
        variant: 'destructive' 
      });
      return;
    }

    if (!category || !description.trim()) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    if (description.trim().length < 20) {
      toast({ title: 'Description too short', description: 'Please provide more details (at least 20 characters)', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast({ title: 'Please log in to submit a report', variant: 'destructive' });
        return;
      }

      const response = await fetch('/api/moderation/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          reported_user_id: reportedUserId,
          category,
          description: description.trim(),
          screenshot_urls: screenshots
        })
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.message);

      toast({ title: 'Report submitted', description: 'Thank you for helping keep our community safe.' });
      setOpen(false);
      setCategory('');
      setDescription('');
      setScreenshots([]);
    } catch (err: any) {
      toast({ title: 'Failed to submit report', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="text-red-500 border-red-500/30 hover:bg-red-500/10">
            <Flag className="w-4 h-4 mr-2" />
            Report
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg bg-black border-2 border-red-500/50 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-red-500 font-press-start text-sm flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            REPORT USER
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="bg-gray-900/50 border border-gray-700 p-3 rounded">
            <p className="text-gray-400 text-sm">
              Reporting: <span className="text-white font-semibold">@{reportedUsername}</span>
            </p>
          </div>

          <div>
            <Label className="text-gray-300 font-press-start text-xs mb-2 block">CATEGORY *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-black border-gray-700 text-white">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-black border-gray-700">
                {REPORT_CATEGORIES.map(cat => (
                  <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-gray-800">
                    <div>
                      <div className="font-medium">{cat.label}</div>
                      <div className="text-xs text-gray-400">{cat.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-300 font-press-start text-xs mb-2 block">DESCRIPTION *</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe the issue in detail. Include specific examples, dates, or context that would help us investigate."
              className="bg-black border-gray-700 text-white min-h-[120px]"
              maxLength={2000}
            />
            <p className="text-xs text-gray-500 mt-1">{description.length}/2000 characters</p>
          </div>

          <div>
            <Label className="text-gray-300 font-press-start text-xs mb-2 block">SCREENSHOTS (Optional)</Label>
            <div className="space-y-2">
              {screenshots.map((url, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-900 p-2 rounded">
                  <img src={url} alt={`Screenshot ${index + 1}`} className="w-16 h-16 object-cover rounded" />
                  <span className="text-gray-400 text-sm flex-1 truncate">Screenshot {index + 1}</span>
                  <Button variant="ghost" size="sm" onClick={() => removeScreenshot(index)} className="text-red-500">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {screenshots.length < 3 && (
                <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-700 rounded cursor-pointer hover:border-gray-500 transition-colors">
                  <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" disabled={uploading} />
                  {uploading ? <Loader2 className="w-5 h-5 animate-spin text-gray-400" /> : <Upload className="w-5 h-5 text-gray-400" />}
                  <span className="text-gray-400 text-sm">Upload screenshots (max 3, 5MB each)</span>
                </label>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t border-gray-800">
            <Button onClick={() => setOpen(false)} variant="outline" className="flex-1" disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1 bg-red-600 hover:bg-red-700" disabled={submitting || !category || !description.trim()}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Flag className="w-4 h-4 mr-2" />}
              Submit Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
