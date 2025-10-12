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
        return 'border-green-500 shadow-green-500/30';
      case 'revoked':
        return 'border-maximally-yellow shadow-maximally-yellow/30';
      case 'invalid_id':
        return 'border-maximally-red shadow-maximally-red/30';
      default:
        return 'border-maximally-red shadow-maximally-red/30';
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
        <div className="min-h-screen bg-black text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-maximally-red mx-auto"></div>
              <h2 className="mt-6 font-press-start text-lg text-maximally-red">
                VERIFYING CERTIFICATE
              </h2>
              <p className="mt-4 text-sm text-gray-400 font-jetbrains">
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
        <div className="min-h-screen bg-black text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <XCircle className="w-16 h-16 text-maximally-red mx-auto mb-4" />
              <h2 className="mt-6 font-press-start text-lg text-maximally-red">
                VERIFICATION ERROR
              </h2>
              <p className="mt-4 text-sm text-gray-400 font-jetbrains">
                {error || 'Failed to verify certificate'}
              </p>
              <div className="mt-6">
                <Link
                  to="/"
                  className="pixel-button bg-maximally-red text-white font-press-start text-xs px-6 py-3 hover:bg-maximally-red/90 transition-colors"
                >
                  GO_HOME
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

      <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-press-start text-2xl md:text-3xl text-maximally-red mb-6">
              CERTIFICATE VERIFICATION
            </h1>
            <p className="text-lg text-gray-300 font-jetbrains">
              Certificate ID: <span className="font-mono font-bold text-maximally-yellow">{certificate_id}</span>
            </p>
          </div>

          <div className={`bg-gray-900 border-4 ${getStatusColor(status)} p-8 minecraft-block`}>
            <div className="text-center">
              {renderStatusIcon(status)}
              
              <h2 className="font-press-start text-lg md:text-xl text-white mb-4">
                {status === 'verified' && '✓ CERTIFICATE VERIFIED'}
                {status === 'revoked' && '⚠ CERTIFICATE REVOKED'}
                {status === 'invalid_id' && '✗ INVALID CERTIFICATE ID'}
                {status === 'error' && '✗ VERIFICATION ERROR'}
              </h2>
              
              <p className="text-base text-gray-300 font-jetbrains mb-6">
                {message}
              </p>

              {certificate && (
                <div className="bg-black border-2 border-gray-700 rounded-lg p-6 text-left">
                  <h3 className="font-press-start text-base text-maximally-yellow mb-6">
                    CERTIFICATE DETAILS
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <span className="font-jetbrains text-sm text-gray-400">Holder Name:</span>
                      <span className="ml-3 text-white text-lg font-bold font-jetbrains">
                        {certificate.participant_name}
                      </span>
                    </div>
                    
                    {certificate.participant_email && status === 'verified' && (
                      <div>
                        <span className="font-jetbrains text-sm text-gray-400">Email:</span>
                        <span className="ml-3 text-white font-jetbrains">
                          {certificate.participant_email}
                        </span>
                      </div>
                    )}
                    
                    <div>
                      <span className="font-jetbrains text-sm text-gray-400">Event:</span>
                      <span className="ml-3 text-maximally-red font-bold font-jetbrains">
                        {certificate.hackathon_name}
                      </span>
                    </div>
                    
                    <div>
                      <span className="font-jetbrains text-sm text-gray-400">Type:</span>
                      <span className="ml-3 text-white font-jetbrains">
                        {certificate.type}
                      </span>
                    </div>
                    
                    {certificate.position && (
                      <div>
                        <span className="font-jetbrains text-sm text-gray-400">Position:</span>
                        <span className="ml-3 text-maximally-yellow font-bold font-jetbrains">
                          {certificate.position}
                        </span>
                      </div>
                    )}
                    
                    <div>
                      <span className="font-jetbrains text-sm text-gray-400">Issued Date:</span>
                      <span className="ml-3 text-white font-jetbrains">
                        {formatDate(certificate.created_at)}
                      </span>
                    </div>
                  </div>

                  {status === 'verified' && (certificate.pdf_url || certificate.jpg_url) && (
                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <h4 className="font-press-start text-sm text-maximally-red mb-4">
                        CERTIFICATE FILES
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {certificate.pdf_url && (
                          <a
                            href={certificate.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pixel-button bg-maximally-red text-white font-press-start text-xs px-4 py-2 flex items-center gap-2 hover:bg-maximally-red/90 transition-colors"
                          >
                            <Download className="w-3 h-3" />
                            DOWNLOAD_PDF
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {certificate.jpg_url && (
                          <a
                            href={certificate.jpg_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pixel-button bg-maximally-blue text-white font-press-start text-xs px-4 py-2 flex items-center gap-2 hover:bg-maximally-blue/90 transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            VIEW_IMAGE
                            <ExternalLink className="w-3 h-3" />
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
                  className="pixel-button bg-gray-800 border-2 border-gray-600 text-white font-press-start text-xs px-6 py-3 hover:bg-gray-700 transition-colors"
                >
                  GO_HOME
                </Link>
                
                <button
                  onClick={() => window.location.reload()}
                  className="pixel-button bg-maximally-red text-white font-press-start text-xs px-6 py-3 hover:bg-maximally-red/90 transition-colors"
                >
                  VERIFY_AGAIN
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-gray-900 border-2 border-gray-800 rounded-lg p-6">
              <p className="text-sm text-gray-400 font-jetbrains">
                This certificate verification is powered by Maximally's secure verification system.
                If you have questions about this certificate, please{' '}
                <Link to="/contact" className="text-maximally-red hover:text-maximally-red/80 transition-colors font-bold">
                  contact us
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CertificateVerification;