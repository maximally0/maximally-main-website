import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, XCircle, ExternalLink, Download, Eye, Award } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/supabaseClient';

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
        if (!supabase) {
          throw new Error('Database connection not available');
        }

        const { data: certificate, error: certError } = await supabase
          .from('certificates')
          .select('*')
          .eq('certificate_id', certificate_id.toUpperCase())
          .single();

        if (certError || !certificate) {
          setVerification({
            success: true,
            status: 'invalid_id',
            message: 'Invalid certificate ID',
            certificate_id: certificate_id.toUpperCase()
          });
        } else if ((certificate as any).status !== 'active') {
          const cert = certificate as any;
          setVerification({
            success: true,
            status: 'revoked',
            message: 'This certificate has been revoked',
            certificate_id: certificate_id.toUpperCase(),
            certificate: {
              participant_name: cert.participant_name,
              hackathon_name: cert.hackathon_name,
              type: cert.type,
              position: cert.position,
              created_at: cert.created_at
            }
          });
        } else {
          const cert = certificate as any;
          setVerification({
            success: true,
            status: 'verified',
            message: 'Certificate is verified and valid',
            certificate_id: certificate_id.toUpperCase(),
            certificate: {
              participant_name: cert.participant_name,
              participant_email: cert.participant_email,
              hackathon_name: cert.hackathon_name,
              type: cert.type,
              position: cert.position,
              pdf_url: cert.pdf_url,
              jpg_url: cert.jpg_url,
              created_at: cert.created_at
            }
          });
        }
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
        return <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />;
      case 'revoked':
        return <AlertCircle className="w-16 h-16 text-amber-400 mx-auto mb-4" />;
      case 'invalid_id':
        return <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />;
      default:
        return <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'verified':
        return { gradient: 'from-green-900/40 to-emerald-900/30', border: 'border-green-500/50' };
      case 'revoked':
        return { gradient: 'from-amber-900/40 to-orange-900/30', border: 'border-amber-500/50' };
      case 'invalid_id':
        return { gradient: 'from-red-900/40 to-rose-900/30', border: 'border-red-500/50' };
      default:
        return { gradient: 'from-red-900/40 to-rose-900/30', border: 'border-red-500/50' };
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
        <div className="min-h-screen bg-black text-white flex items-center justify-center py-12 px-4 relative">
          <div className="fixed inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
          <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.15)_0%,transparent_50%)]" />
          
          <div className="max-w-md w-full space-y-8 relative z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto"></div>
              <h2 className="mt-6 font-press-start text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
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
        <div className="min-h-screen bg-black text-white flex items-center justify-center py-12 px-4 relative">
          <div className="fixed inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
          <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.10)_0%,transparent_50%)]" />
          
          <div className="max-w-md w-full space-y-8 relative z-10">
            <div className="text-center">
              <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="mt-6 font-press-start text-lg text-red-400">
                VERIFICATION ERROR
              </h2>
              <p className="mt-4 text-sm text-gray-400 font-jetbrains">
                {error || 'Failed to verify certificate'}
              </p>
              <div className="mt-6">
                <Link
                  to="/"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-press-start text-xs px-6 py-3 border border-pink-500/50 transition-all inline-block"
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
  const statusStyles = getStatusStyles(status);

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

      <div className="min-h-screen bg-black text-white py-12 px-4 pt-24 relative">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_50%)]" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(236,72,153,0.10)_0%,transparent_50%)]" />
        
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/15 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-pink-500/12 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600/30 to-pink-600/20 border border-purple-500/40 mb-6">
              <Award className="h-5 w-5 text-purple-400" />
              <span className="font-press-start text-xs text-purple-300">CERTIFICATE VERIFICATION</span>
            </div>
            
            <h1 className="font-press-start text-2xl md:text-3xl bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-6">
              CERTIFICATE VERIFICATION
            </h1>
            <p className="text-lg text-gray-300 font-jetbrains">
              Certificate ID: <span className="font-mono font-bold text-purple-400">{certificate_id}</span>
            </p>
          </div>

          <div className={`bg-gradient-to-br ${statusStyles.gradient} border ${statusStyles.border} p-8`}>
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
                <div className="bg-black/50 border border-purple-500/30 p-6 text-left">
                  <h3 className="font-press-start text-base bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
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
                      <span className="ml-3 text-purple-400 font-bold font-jetbrains">
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
                        <span className="ml-3 text-amber-400 font-bold font-jetbrains">
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
                    <div className="mt-6 pt-6 border-t border-purple-500/30">
                      <h4 className="font-press-start text-sm text-pink-400 mb-4">
                        CERTIFICATE FILES
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {certificate.pdf_url && (
                          <a
                            href={certificate.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-press-start text-xs px-4 py-2 flex items-center gap-2 border border-pink-500/50 transition-all"
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
                            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-press-start text-xs px-4 py-2 flex items-center gap-2 border border-cyan-500/50 transition-all"
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

              <div className="mt-8 flex justify-center gap-4 flex-wrap">
                <Link
                  to="/"
                  className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600 hover:border-purple-500/50 text-gray-300 hover:text-white font-press-start text-xs px-6 py-3 transition-all"
                >
                  GO_HOME
                </Link>
                
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-press-start text-xs px-6 py-3 border border-pink-500/50 transition-all"
                >
                  VERIFY_AGAIN
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/30 border border-purple-500/30 p-6">
              <p className="text-sm text-gray-400 font-jetbrains">
                This certificate verification is powered by Maximally's secure verification system.
                If you have questions about this certificate, please{' '}
                <Link to="/contact" className="text-purple-400 hover:text-pink-400 transition-colors font-bold">
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
