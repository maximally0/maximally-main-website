import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Shield, Loader2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { changePassword, setPasswordForOAuthUser, checkIfUserHasPassword } from '@/lib/supabaseClient';

interface PasswordStrength {
  score: number;
  feedback: string[];
  isValid: boolean;
}

function calculatePasswordStrength(password: string): PasswordStrength {
  let score = 0;
  const feedback: string[] = [];
  
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password must be at least 8 characters long');
  }
  
  if (password.length >= 12) {
    score += 1;
  } else if (password.length >= 8) {
    feedback.push('Consider using 12+ characters for better security');
  }
  
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include both uppercase and lowercase letters');
  }
  
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one number');
  }
  
  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one special character (!@#$%^&*)');
  }
  
  const isValid = password.length >= 8 && score >= 3;
  
  return { score, feedback, isValid };
}

export default function PasswordSettings() {
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Action state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean | null;
    message: string;
  }>({ success: null, message: '' });
  
  // Check if user has password on component mount
  useEffect(() => {
    const checkPassword = async () => {
      try {
        const userHasPassword = await checkIfUserHasPassword();
        setHasPassword(userHasPassword);
      } catch (error) {
        console.error('Error checking password status:', error);
        setHasPassword(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkPassword();
  }, []);
  
  // Prevent unnecessary re-checks that cause flickering
  const stableHasPassword = hasPassword;
  
  // Password strength calculation
  const passwordStrength = newPassword ? calculatePasswordStrength(newPassword) : null;
  const passwordsMatch = newPassword && confirmPassword ? newPassword === confirmPassword : null;
  
  // Form validation
  const isFormValid = () => {
    if (stableHasPassword) {
      // For existing password users: require current password
      return (
        currentPassword.trim() !== '' &&
        passwordStrength?.isValid &&
        passwordsMatch === true
      );
    } else {
      // For OAuth users setting password: no current password needed
      return (
        passwordStrength?.isValid &&
        passwordsMatch === true
      );
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;
    
    setIsSubmitting(true);
    setResult({ success: null, message: '' });
    
    try {
      let response;
      if (stableHasPassword) {
        // Change existing password
        response = await changePassword(currentPassword, newPassword);
      } else {
        // Set password for OAuth user
        response = await setPasswordForOAuthUser(newPassword);
      }
      
      if (response.success) {
        setResult({
          success: true,
          message: stableHasPassword ? 'Password changed successfully!' : 'Password set successfully! You can now sign in with email and password.'
        });
        
        // Clear form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // Update hasPassword state if it was the first time setting password
        if (!stableHasPassword) {
          setHasPassword(true);
        }
      } else {
        setResult({
          success: false,
          message: response.error || (stableHasPassword ? 'Failed to change password' : 'Failed to set password')
        });
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || 'An unexpected error occurred'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setResult({ success: null, message: '' });
  };
  
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading password settings...</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-maximally-red" />
          <CardTitle className="text-white">
            {stableHasPassword ? 'Change Password' : 'Set Password'}
          </CardTitle>
        </div>
        <CardDescription className="text-gray-400">
          {stableHasPassword 
            ? 'Update your account password for better security.'
            : 'Set a password to enable email and password sign-in alongside your OAuth account.'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password - only show for users who have a password */}
          {stableHasPassword && (
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-gray-300">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setResult({ success: null, message: '' });
                  }}
                  placeholder="Enter your current password"
                  className="pr-10"
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
          )}
          
          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-gray-300">
              {stableHasPassword ? 'New Password' : 'Password'}
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setResult({ success: null, message: '' });
                }}
                placeholder={stableHasPassword ? "Enter your new password" : "Enter your password"}
                className="pr-10"
                disabled={isSubmitting}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            
            {/* Password Strength Indicator */}
            {newPassword && passwordStrength && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${{
                        1: 'w-1/5 bg-red-500',
                        2: 'w-2/5 bg-orange-500',
                        3: 'w-3/5 bg-yellow-500',
                        4: 'w-4/5 bg-blue-500',
                        5: 'w-full bg-green-500'
                      }[passwordStrength.score] || 'w-0 bg-gray-300'}`}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {{
                      1: 'Weak',
                      2: 'Fair', 
                      3: 'Good',
                      4: 'Strong',
                      5: 'Very Strong'
                    }[passwordStrength.score] || 'Very Weak'}
                  </span>
                </div>
                
                {passwordStrength.feedback.length > 0 && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <ul className="list-disc list-inside space-y-1">
                      {passwordStrength.feedback.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setResult({ success: null, message: '' });
                }}
                placeholder="Confirm your password"
                className="pr-10"
                disabled={isSubmitting}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
              
              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                  {passwordsMatch === true ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              )}
            </div>
            
            {/* Password Match Message */}
            {confirmPassword && passwordsMatch !== null && (
              <p className={`text-sm ${
                passwordsMatch ? 'text-green-600' : 'text-red-600'
              }`}>
                {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
              </p>
            )}
          </div>
          
          {/* Same Password Warning */}
          {stableHasPassword && currentPassword && newPassword && currentPassword === newPassword && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                Your new password should be different from your current password.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Result Message */}
          {result.success !== null && (
            <Alert className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <AlertDescription className={result.success ? 'text-green-800' : 'text-red-800'}>
                {result.message}
              </AlertDescription>
            </Alert>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className="bg-maximally-red hover:bg-maximally-red/90 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {stableHasPassword ? 'Changing...' : 'Setting...'}
                </>
              ) : (
                stableHasPassword ? 'Change Password' : 'Set Password'
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
        
        {/* Security Tips */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Password Security Tips:</h4>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Use a mix of uppercase, lowercase, numbers, and special characters</li>
            <li>• Make it at least 12 characters long for better security</li>
            <li>• Avoid common words, personal information, or patterns</li>
            <li>• Consider using a password manager to generate and store secure passwords</li>
            <li>• Don't reuse passwords from other accounts</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}