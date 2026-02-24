
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { useState, useRef } from 'react';
import { Upload, Video, Check, X } from 'lucide-react';

interface VideoPitchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitSuccess: () => void;
}

const VideoPitchDialog = ({ open, onOpenChange, onSubmitSuccess }: VideoPitchDialogProps) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Check if it's a video
      if (!file.type.startsWith('video/')) {
        setError('Please upload a video file');
        setVideoFile(null);
        return;
      }
      
      // Check if it's under 50MB
      if (file.size > 50 * 1024 * 1024) {
        setError('Video must be under 50MB');
        setVideoFile(null);
        return;
      }
      
      setVideoFile(file);
    }
  };

  const handleUpload = async () => {
    if (!videoFile) {
      setError('Please select a video to upload');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      // Simulating upload - in a real implementation, you would send to a server
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSuccess(true);
      
      // Reset after success
      setTimeout(() => {
        onSubmitSuccess();
        setVideoFile(null);
        setIsSuccess(false);
        setIsUploading(false);
        onOpenChange(false);
      }, 1500);
    } catch (error) {
      setError('Failed to upload video. Please try again.');
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="font-space font-bold text-xl text-center mb-4">Submit Your 1-Minute Pitch</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <p className="font-space text-maximally-black/80 mb-6">
              Record a 1-minute video telling us why you want to join the Maximally Summer Bootcamp and what you hope to achieve.
            </p>
          </div>

          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
              videoFile ? 'border-maximally-green bg-maximally-green/5' : 'border-maximally-blue'
            } ${error ? 'border-maximally-red bg-maximally-red/5' : ''}`}
          >
            {videoFile ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Video className="h-12 w-12 text-maximally-green" />
                </div>
                <p className="font-space font-medium">
                  {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
                <Button 
                  variant="outline" 
                  className="border-maximally-red text-maximally-red hover:bg-maximally-red hover:text-white"
                  onClick={() => setVideoFile(null)}
                >
                  Remove <X className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Upload className="h-12 w-12 text-maximally-blue" />
                </div>
                <p className="font-space">Drag and drop your video here or click to browse</p>
                <Button 
                  variant="outline" 
                  className="border-maximally-blue text-maximally-blue hover:bg-maximally-blue hover:text-white"
                  onClick={triggerFileInput}
                >
                  Select Video
                </Button>
              </div>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="video/*"
              onChange={handleFileChange}
            />
          </div>

          {error && (
            <div className="text-maximally-red font-space text-sm">
              {error}
            </div>
          )}

          <div className="pt-4 text-sm font-space text-maximally-black/60">
            <p>Requirements:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Maximum 1 minute in length</li>
              <li>File size under 50MB</li>
              <li>Acceptable formats: MP4, MOV, AVI, WEBM</li>
            </ul>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleUpload}
              disabled={!videoFile || isUploading || isSuccess}
              className="bg-maximally-blue text-white hover:bg-maximally-blue/90 font-space"
            >
              {isUploading && "Uploading..."}
              {isSuccess && (
                <>
                  Submitted Successfully <Check className="ml-2 h-4 w-4" />
                </>
              )}
              {!isUploading && !isSuccess && "Submit Video"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPitchDialog;
