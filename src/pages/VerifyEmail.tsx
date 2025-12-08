import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [userName, setUserName] = useState('User');
  const [token, setToken] = useState('');

  useEffect(() => {
    // Get verification parameters from URL
    const userId = searchParams.get('userId');
    const secret = searchParams.get('secret');
    
    setToken(secret || 'demo_token_abc123xyz');

    // Simulate verification process
    const verifyEmail = async () => {
      try {
        // Add a delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (userId && secret) {
          // TODO: Implement actual Appwrite email verification
          // const response = await account.updateVerification(userId, secret);
          
          setVerificationStatus('success');
          setUserName(user?.name || 'Alex Johnson');
        } else {
          // Redirect to verification failed page if no valid parameters
          navigate('/verification-failed');
        }
      } catch (error) {
        console.error('Verification failed:', error);
        // Redirect to verification failed page on error
        navigate('/verification-failed');
      }
    };

    verifyEmail();
  }, [searchParams, user, navigate]);

  const VerifiedIcon = () => (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" stroke="#10B981" strokeWidth="4" fill="none"/>
      <path d="M25 40L35 50L55 30" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const LoadingIcon = () => (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-spin">
      <circle cx="40" cy="40" r="36" stroke="#3B82F6" strokeWidth="4" strokeOpacity="0.2" fill="none"/>
      <path d="M40 4 A36 36 0 0 1 76 40" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  );

  const ErrorIcon = () => (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" stroke="#EF4444" strokeWidth="4" fill="none"/>
      <path d="M30 30L50 50M50 30L30 50" stroke="#EF4444" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  );

  const getIcon = () => {
    switch (verificationStatus) {
      case 'pending':
        return <LoadingIcon />;
      case 'success':
        return <VerifiedIcon />;
      case 'error':
        return <ErrorIcon />;
    }
  };

  const getTitle = () => {
    switch (verificationStatus) {
      case 'pending':
        return 'Verifying Email';
      case 'success':
        return 'Email Verified';
      case 'error':
        return 'Verification Failed';
    }
  };

  const getMessage = () => {
    switch (verificationStatus) {
      case 'pending':
        return 'Please wait while we verify your email address...';
      case 'success':
        return `Thanks, ${userName} — your email is verified. You can now access StudentPerks.`;
      case 'error':
        return 'The verification link is invalid or has expired. Please request a new verification email.';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] pt-16">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              SP
            </div>
            <span className="text-base font-normal text-gray-900">StudentPerks</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-16">
        <div className="relative w-full max-w-[512px]">
          {/* Background blur effects */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 pointer-events-none" />
          <div className="absolute top-40 left-0 w-96 h-96 bg-teal-200 rounded-full blur-3xl opacity-20 pointer-events-none" />
          
          {/* Card */}
          <div className="relative bg-white rounded-[10px] shadow-[0px_8px_16px_0px_rgba(0,0,0,0.06),0px_20px_40px_0px_rgba(0,0,0,0.08)] p-12">
            {/* Icon and Content */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="mb-6">
                {getIcon()}
              </div>
              
              <h1 className="text-4xl font-normal text-gray-900 mb-4">
                {getTitle()}
              </h1>
              
              <p className="text-lg text-gray-600 leading-7 max-w-md">
                {getMessage()}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-4 mb-8">
              {verificationStatus === 'success' && (
                <>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full h-14 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-[10px] text-base font-normal transition-all duration-200"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full h-11 text-blue-600 hover:text-blue-700 text-sm font-normal transition-colors"
                  >
                    Sign in
                  </button>
                </>
              )}

              {verificationStatus === 'error' && (
                <>
                  <button
                    onClick={() => navigate('/signup')}
                    className="w-full h-14 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-[10px] text-base font-normal transition-all duration-200"
                  >
                    Sign Up Again
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full h-11 text-blue-600 hover:text-blue-700 text-sm font-normal transition-colors"
                  >
                    Sign in
                  </button>
                </>
              )}

              {verificationStatus === 'pending' && (
                <div className="w-full h-14 flex items-center justify-center text-gray-500">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  <span>Processing...</span>
                </div>
              )}
            </div>

            {/* Admin/Test Preview (only in development or for testing) */}
            {process.env.NODE_ENV === 'development' && verificationStatus === 'success' && (
              <div className="border-t border-gray-200 pt-6">
                <details className="text-gray-500 text-xs">
                  <summary className="cursor-pointer mb-2">Admin/Test Preview</summary>
                  <div className="bg-gray-50 rounded p-3 font-mono text-[11px] space-y-1">
                    <div>
                      <span className="font-bold">Token:</span> {token}
                    </div>
                    <div>
                      <span className="font-bold">Status:</span> success
                    </div>
                    <div>
                      <span className="font-bold">User:</span> {userName}
                    </div>
                  </div>
                </details>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VerifyEmail;
