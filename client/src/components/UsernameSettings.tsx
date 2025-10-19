import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { updateUsername, isUsernameAvailable } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

export default function UsernameSettings() {
  const { profile, refreshProfile } = useAuth();
  const [newUsername, setNewUsername] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [availability, setAvailability] = useState<{
    available: boolean | null;
    message: string;
  }>({ available: null, message: '' });
  const [updateResult, setUpdateResult] = useState<{
    success: boolean | null;
    message: string;
  }>({ success: null, message: '' });

  // Initialize with current username
  useEffect(() => {
    if (profile?.username && !newUsername) {
      setNewUsername(profile.username);
    }
  }, [profile?.username, newUsername]);

  // Debounced username availability check
  useEffect(() => {
    if (!newUsername || newUsername === profile?.username) {
      setAvailability({ available: null, message: '' });
      return;
    }

    if (newUsername.length < 3) {
      setAvailability({ 
        available: false, 
        message: 'Username must be at least 3 characters long' 
      });
      return;
    }

    if (newUsername.length > 30) {
      setAvailability({ 
        available: false, 
        message: 'Username must be no more than 30 characters long' 
      });
      return;
    }

    if (!/^[a-z0-9]+$/.test(newUsername.toLowerCase())) {
      setAvailability({ 
        available: false, 
        message: 'Username can only contain letters and numbers' 
      });
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsChecking(true);
      try {
        const available = await isUsernameAvailable(newUsername.toLowerCase());
        setAvailability({
          available,
          message: available ? 'Username is available!' : 'Username is already taken'
        });
      } catch (error) {
        setAvailability({
          available: false,
          message: 'Error checking availability'
        });
      } finally {
        setIsChecking(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [newUsername, profile?.username]);

  const handleUpdateUsername = async () => {
    if (!newUsername || newUsername === profile?.username || availability.available !== true) {
      return;
    }

    setIsUpdating(true);
    setUpdateResult({ success: null, message: '' });

    try {
      const result = await updateUsername(newUsername.toLowerCase());
      
      if (result.success) {
        setUpdateResult({
          success: true,
          message: 'Username updated successfully!'
        });
        // Refresh profile to get updated username
        await refreshProfile();
      } else {
        setUpdateResult({
          success: false,
          message: result.error || 'Failed to update username'
        });
      }
    } catch (error: any) {
      setUpdateResult({
        success: false,
        message: error.message || 'Failed to update username'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const hasChanged = newUsername !== profile?.username;
  const canUpdate = hasChanged && availability.available === true && !isChecking && !isUpdating;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Username Settings</CardTitle>
        <CardDescription>
          Your username is how others can find and mention you on Maximally.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="username"
                type="text"
                value={newUsername}
                onChange={(e) => {
                  const value = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '');
                  setNewUsername(value);
                  setUpdateResult({ success: null, message: '' });
                }}
                placeholder="Enter your username"
                className="pr-8"
                disabled={isUpdating}
              />
              {isChecking && (
                <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-gray-400" />
              )}
              {!isChecking && availability.available === true && (
                <CheckCircle2 className="absolute right-2 top-2.5 h-4 w-4 text-green-500" />
              )}
              {!isChecking && availability.available === false && newUsername.length >= 3 && (
                <XCircle className="absolute right-2 top-2.5 h-4 w-4 text-red-500" />
              )}
            </div>
            <Button 
              onClick={handleUpdateUsername}
              disabled={!canUpdate}
              className="shrink-0"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                'Update'
              )}
            </Button>
          </div>
          
          {availability.message && (
            <p className={`text-sm ${
              availability.available === true 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {availability.message}
            </p>
          )}
        </div>

        {updateResult.success !== null && (
          <Alert className={updateResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            <AlertDescription className={updateResult.success ? 'text-green-800' : 'text-red-800'}>
              {updateResult.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-gray-600">
          <p><strong>Username rules:</strong></p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>3-30 characters long</li>
            <li>Letters and numbers only (a-z, 0-9)</li>
            <li>Must be unique</li>
            <li>Cannot be changed frequently</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}