import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, XCircle, ExternalLink, Download, Eye } from 'lucide-react';
import { Helmet } from 'react-helmet';

interface CertificateData {
  participant_name: string;
  participant_email?: string;
  hackathon_name: string;
  type: string;
  position?: string;
  pdf_url?: string;
  jpg_url?: string;
  created_at: string;
}

interface VerificationResponse {
  success: boolean;
  status: 'verified' | 'invalid_id' | 'revoked' | 'error';
  message: string;
  certificate_id: string;
  certificate?: CertificateData;
}

const CertificateVerification: React.FC = () => {
  const { certificate_id } = useParams<{ certificate_id: string }>();
  const [verification, setVerification] = useState<VerificationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyCertificate = async () => {
      if (!certificate_id) {
        setError('No certificate ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/certificates/verify/${encodeURIComponent(certificate_id)}`);
        const data = await response.json();

        if (!response.ok && response.status !== 200) {
          throw new Error(data.message || 'Failed to verify certificate');
        }

        setVerification(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while verifying the certificate');
      } finally {
        setLoading(false);
      }
    };

    verifyCertificate();
  }, [certificate_id]);

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />;
      case 'revoked':
        return <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />;
      case 'invalid_id':
        return <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />;
      default:
        return <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'revoked':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'invalid_id':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Verifying Certificate - Maximally</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Verifying Certificate
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Please wait while we verify certificate ID: {certificate_id}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !verification) {
    return (
      <>
        <Helmet>
          <title>Certificate Verification Error - Maximally</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Verification Error
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {error || 'Failed to verify certificate'}
              </p>
              <div className="mt-6">
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Go Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const { status, message, certificate } = verification;

  return (
    <>
      <Helmet>
        <title>
          {status === 'verified' 
            ? `Certificate Verified - ${certificate?.participant_name} - Maximally`
            : 'Certificate Verification - Maximally'
          }
        </title>
        <meta name="description" content={`Certificate verification for ID: ${certificate_id}`} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Certificate Verification
            </h1>
            <p className="text-lg text-gray-600">
              Certificate ID: <span className="font-mono font-semibold">{certificate_id}</span>
            </p>
          </div>

          <div className={`bg-white shadow-lg rounded-lg border-2 ${getStatusColor(status)} p-8`}>
            <div className="text-center">
              {renderStatusIcon(status)}
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {status === 'verified' && 'Certificate Verified ✓'}
                {status === 'revoked' && 'Certificate Revoked'}
                {status === 'invalid_id' && 'Invalid Certificate ID'}
                {status === 'error' && 'Verification Error'}
              </h2>
              
              <p className="text-lg text-gray-600 mb-6">
                {message}
              </p>

              {certificate && (
                <div className="bg-gray-50 rounded-lg p-6 text-left">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Certificate Details
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Holder Name:</span>
                      <span className="ml-2 text-gray-900 text-lg font-semibold">
                        {certificate.participant_name}
                      </span>
                    </div>
                    
                    {certificate.participant_email && status === 'verified' && (
                      <div>
                        <span className="font-medium text-gray-700">Email:</span>
                        <span className="ml-2 text-gray-900">
                          {certificate.participant_email}
                        </span>
                      </div>
                    )}
                    
                    <div>
                      <span className="font-medium text-gray-700">Event:</span>
                      <span className="ml-2 text-gray-900">
                        {certificate.hackathon_name}
                      </span>
                    </div>
                    
                    <div>
                      <span className="font-medium text-gray-700">Type:</span>
                      <span className="ml-2 text-gray-900">
                        {certificate.type}
                      </span>
                    </div>
                    
                    {certificate.position && (
                      <div>
                        <span className="font-medium text-gray-700">Position:</span>
                        <span className="ml-2 text-gray-900 font-semibold">
                          {certificate.position}
                        </span>
                      </div>
                    )}
                    
                    <div>
                      <span className="font-medium text-gray-700">Issued Date:</span>
                      <span className="ml-2 text-gray-900">
                        {formatDate(certificate.created_at)}
                      </span>
                    </div>
                  </div>

                  {status === 'verified' && (certificate.pdf_url || certificate.jpg_url) && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-lg font-medium text-gray-900 mb-3">
                        Certificate Files
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {certificate.pdf_url && (
                          <a
                            href={certificate.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </a>
                        )}
                        {certificate.jpg_url && (
                          <a
                            href={certificate.jpg_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Image
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-8 flex justify-center space-x-4">
                <Link
                  to="/"
                  className="inline-flex items-center px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Go Home
                </Link>
                
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Verify Again
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              This certificate verification is powered by Maximally's secure verification system.
              If you have questions about this certificate, please{' '}
              <Link to="/contact" className="text-indigo-600 hover:text-indigo-500">
                contact us
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CertificateVerification;