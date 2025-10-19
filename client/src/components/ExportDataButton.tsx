import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Download, FileText, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function ExportDataButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleExportData = async () => {
    if (!supabase) {
      setError('Authentication service not available');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setError('Not authenticated');
        return;
      }

      const response = await fetch('/api/user/export-data', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to export data');
      }

      // Get the filename from the response headers or create a default one
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'maximally-user-data.json';
      
      if (contentDisposition && contentDisposition.includes('filename=')) {
        filename = contentDisposition
          .split('filename=')[1]
          .replace(/['"]/g, '');
      }

      // Create and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Show success feedback
      setSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);

    } catch (err: any) {
      console.error('Export data error:', err);
      setError(err.message || 'Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button 
        variant="outline" 
        className="border-gray-600 text-gray-300 hover:bg-gray-800"
        onClick={handleExportData}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </>
        )}
      </Button>
      
      {error && (
        <p className="text-red-400 text-sm mt-2">{error}</p>
      )}
      
      {success && (
        <div className="flex items-center gap-2 mt-2">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <p className="text-green-500 text-sm">Data exported successfully!</p>
        </div>
      )}
      
      {!loading && !error && !success && (
        <div className="mt-2 flex items-start gap-2">
          <FileText className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <p className="text-gray-500 text-xs">
            Exports your profile information, hackathon participation data, and account details as a JSON file.
          </p>
        </div>
      )}
    </div>
  );
}