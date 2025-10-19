import { useState } from 'react';
import { EmailInput } from '@/components/ui/email-input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { EmailValidationResult } from '@/lib/emailValidation';

export default function TestEmailValidation() {
  const [email, setEmail] = useState('');
  const [validation, setValidation] = useState<EmailValidationResult | null>(null);

  const testEmails = [
    'user@gmail.com', // Should be valid
    'test@10minutemail.com', // Should be disposable
    'admin@guerrillamail.com', // Should be disposable  
    'user@tempmail.com', // Might not be in list
    'test@mailinator.com', // Should be disposable
    'invalid-email' // Should be invalid format
  ];

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Email Validation Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <EmailInput
              label="Test Email Address"
              value={email}
              onChange={(value, validationResult) => {
                setEmail(value);
                setValidation(validationResult || null);
              }}
              onValidationChange={setValidation}
              enableServerValidation={true}
              required
            />

            {validation && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-white font-semibold mb-2">Validation Results:</h3>
                <pre className="text-gray-300 text-sm">
                  {JSON.stringify(validation, null, 2)}
                </pre>
              </div>
            )}

            <div>
              <h3 className="text-white font-semibold mb-2">Quick Test Emails:</h3>
              <div className="grid grid-cols-1 gap-2">
                {testEmails.map((testEmail) => (
                  <button
                    key={testEmail}
                    onClick={() => setEmail(testEmail)}
                    className="text-left p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-sm"
                  >
                    {testEmail}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}