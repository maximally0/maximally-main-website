import React, { useState, useCallback, useEffect } from 'react';
import { Input } from './input';
import { Label } from './label';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

// Import browser-compatible version of the validation utilities
import { validateEmailQuick } from '@/lib/emailValidation';

interface EmailValidationResult {
  isValid: boolean;
  domain: string;
  issues: string[];
  isSafe: boolean;
  isDisposable: boolean;
}

interface EmailInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label?: string;
  value: string;
  onChange: (value: string, validation?: EmailValidationResult) => void;
  onValidationChange?: (validation: EmailValidationResult) => void;
  enableServerValidation?: boolean;
  showValidationIcon?: boolean;
  showValidationMessage?: boolean;
  debounceMs?: number;
  required?: boolean;
}

export function EmailInput({
  label = 'Email',
  value,
  onChange,
  onValidationChange,
  enableServerValidation = false,
  showValidationIcon = true,
  showValidationMessage = true,
  debounceMs = 150, // Faster validation response
  className,
  required,
  ...props
}: EmailInputProps) {
  const [validation, setValidation] = useState<EmailValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Debounced validation function
  const debounce = useCallback((func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  // Client-side validation (quick, no MX check)
  const validateClientSide = useCallback((email: string): EmailValidationResult | null => {
    if (!email.trim()) return null;
    
    try {
      // Use the quick validation function that works in browser
      return validateEmailQuick(email);
    } catch (error) {
      console.warn('Client-side email validation failed:', error);
      return {
        isValid: false,
        domain: '',
        issues: ['Validation error'],
        isSafe: false,
        isDisposable: false
      };
    }
  }, []);

  // Server-side validation (comprehensive with MX check)
  const validateServerSide = useCallback(async (email: string): Promise<EmailValidationResult | null> => {
    if (!enableServerValidation || !email.trim()) return null;

    try {
      setIsValidating(true);
      setServerError(null);

      const response = await fetch('/api/auth/validate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Server validation failed');
      }

      return data.validation;
    } catch (error: any) {
      console.error('Server-side email validation failed:', error);
      setServerError(error.message || 'Unable to verify email');
      return null;
    } finally {
      setIsValidating(false);
    }
  }, [enableServerValidation]);

  // Improved validation flow
  const validateImmediate = useCallback(async (email: string) => {
    // Always do client-side validation first (immediate)
    const clientValidation = validateClientSide(email);
    
    if (clientValidation) {
      // If client-side validation fails (disposable, invalid format), show error immediately
      if (!clientValidation.isValid) {
        setValidation(clientValidation);
        onValidationChange?.(clientValidation);
        return;
      }
      
      // If client-side validation passes but server validation is enabled, wait for server
      if (enableServerValidation) {
        // Set a temporary 'pending server validation' state
        const pendingValidation = {
          ...clientValidation,
          isValid: false, // Don't show as valid until server confirms
          issues: [] // Clear issues for now
        };
        setValidation(pendingValidation);
        onValidationChange?.(pendingValidation);
        
        // Do server validation
        const serverValidation = await validateServerSide(email);
        if (serverValidation) {
          setValidation(serverValidation);
          onValidationChange?.(serverValidation);
        }
      } else {
        // No server validation needed, use client result
        setValidation(clientValidation);
        onValidationChange?.(clientValidation);
      }
    } else {
      setValidation(null);
      onValidationChange?.(null as any);
    }
  }, [validateClientSide, validateServerSide, enableServerValidation, onValidationChange]);
  
  // Debounced version for server validation
  const debouncedValidate = useCallback(
    debounce(validateImmediate, debounceMs),
    [validateImmediate, debounceMs]
  );

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue, validation || undefined);
    
    // Reset validation state
    setValidation(null);
    setServerError(null);
    
    // Trigger validation if email is not empty
    if (newValue.trim()) {
      debouncedValidate(newValue.trim());
    }
  };

  // Validation state helpers
  const getValidationState = () => {
    if (!value.trim()) return 'idle';
    if (isValidating) return 'validating';
    if (serverError) return 'server-error';
    if (!validation) return 'idle';
    
    // If server validation is enabled and we haven't got server results yet, show validating
    if (enableServerValidation && validation.issues.length === 0 && !validation.isValid) {
      return 'validating';
    }
    
    if (validation.isValid) return 'valid';
    if (validation.isDisposable) return 'disposable';
    return 'invalid';
  };

  const getValidationIcon = () => {
    if (!showValidationIcon) return null;
    
    const state = getValidationState();
    const iconClass = "h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2";
    
    switch (state) {
      case 'validating':
        return <Loader2 className={cn(iconClass, "animate-spin text-gray-400")} />;
      case 'valid':
        return <CheckCircle className={cn(iconClass, "text-green-500")} />;
      case 'disposable':
        return <XCircle className={cn(iconClass, "text-red-500")} />;
      case 'invalid':
        return <XCircle className={cn(iconClass, "text-red-500")} />;
      case 'server-error':
        return <AlertCircle className={cn(iconClass, "text-yellow-500")} />;
      default:
        return null;
    }
  };

  const getValidationMessage = () => {
    if (!showValidationMessage) return null;
    
    const state = getValidationState();
    
    switch (state) {
      case 'validating':
        return <span className="text-gray-400 text-sm">Verifying email...</span>;
      case 'valid':
        // Only show "Valid" if server validation is disabled OR server validation passed
        if (!enableServerValidation || (validation && !isValidating)) {
          return (
            <span className="text-green-500 text-sm">
              {validation?.isSafe ? 'Verified email address' : 'Valid email address'}
            </span>
          );
        } else {
          // Server validation is enabled but not complete yet
          return <span className="text-gray-400 text-sm">Verifying email...</span>;
        }
      case 'disposable':
        return <span className="text-red-500 text-sm">Temporary emails are not allowed</span>;
      case 'invalid':
        const firstIssue = validation?.issues?.[0] || 'Invalid email address';
        // Replace long error messages with shorter ones
        let displayMessage = firstIssue;
        if (firstIssue.includes('Disposable/temporary')) {
          displayMessage = 'Temporary emails are not allowed';
        } else if (firstIssue.includes('cannot receive emails')) {
          displayMessage = 'Temporary emails are not allowed';
        }
        return (
          <span className="text-red-500 text-sm">
            {displayMessage}
          </span>
        );
      case 'server-error':
        return <span className="text-yellow-500 text-sm">{serverError}</span>;
      default:
        return null;
    }
  };

  const getBorderColor = () => {
    const state = getValidationState();
    
    switch (state) {
      case 'valid':
        return 'border-green-500 focus:border-green-500';
      case 'disposable':
      case 'invalid':
        return 'border-red-500 focus:border-red-500';
      case 'server-error':
        return 'border-yellow-500 focus:border-yellow-500';
      default:
        return 'border-gray-700 focus:border-maximally-red';
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="email" className="text-gray-200 dark:text-gray-200">
        {label} {required && <span className="text-red-400">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={value}
          onChange={handleChange}
          className={cn(
            "bg-black/50 dark:bg-black/50 text-white dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 pr-10",
            getBorderColor(),
            className
          )}
          required={required}
          {...props}
        />
        {getValidationIcon()}
      </div>
      
      {getValidationMessage()}
    </div>
  );
}