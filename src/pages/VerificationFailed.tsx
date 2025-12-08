import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, AlertCircle } from 'lucide-react';

const VerificationFailed = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(true);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    // Auto-hide toast after 5 seconds
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      // TODO: Implement actual Appwrite resend verification
      // await account.createVerification(`${window.location.origin}/verify-email`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setResendSuccess(true);
      setShowToast(true);
      
      // Redirect to login after successful resend
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Resend verification failed:', error);
    } finally {
      setIsResending(false);
    }
  };

  const ErrorIcon = () => (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" stroke="#EF4444" strokeWidth="4" fill="none"/>
      <path d="M30 30L50 50M50 30L30 50" stroke="#EF4444" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#f8fbff] pt-16 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
          <div className="bg-white border border-red-200 rounded-lg shadow-lg p-4 flex items-start gap-3 max-w-md">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {resendSuccess ? 'Verification email sent!' : 'Verification failed. Please try again.'}
              </p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-gray-400 hover:text-gray-600 shrink-0 bg-transparent border-0 cursor-pointer p-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
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
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-200 rounded-full blur-3xl opacity-20 pointer-events-none" />
          <div className="absolute top-40 left-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-20 pointer-events-none" />
          
          {/* Card */}
          <div className="relative bg-white rounded-[10px] shadow-[0px_8px_16px_0px_rgba(0,0,0,0.06),0px_20px_40px_0px_rgba(0,0,0,0.08)] p-12">
            {/* Icon and Content */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="mb-6">
                <ErrorIcon />
              </div>
              
              <h1 className="text-4xl font-normal text-gray-900 mb-4">
                Verification Failed
              </h1>
              
              <p className="text-lg text-gray-600 leading-7 max-w-md">
                The verification link is invalid or has expired.
                <br />
                Please request a new verification email.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-4 mb-8">
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full h-14 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-[10px] text-base font-normal transition-all duration-200 disabled:cursor-not-allowed"
              >
                {isResending ? 'Sending...' : 'Resend Verification'}
              </button>
              
              <button
                onClick={() => navigate('/login')}
                className="w-full h-11 text-blue-600 hover:text-blue-700 text-sm font-normal transition-colors bg-transparent border-0 cursor-pointer"
              >
                Back to sign in
              </button>
            </div>

            {/* Help text */}
            <div className="border-t border-gray-200 pt-6">
              <p className="text-xs text-gray-500 text-center">
                Need help?{' '}
                <a 
                  href="mailto:support@studentperks.com" 
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default VerificationFailed;
