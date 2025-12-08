import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import './Login/AuthStyles.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Logic from auth-bg.js for background animations
    const bgContainer = document.querySelector('[data-auth-bg]');
    if (bgContainer) {
      const icons = [
        { svg: '🎓', size: 52, x: '10vw', y: '15vh', dur: '18s' },
        { svg: '📚', size: 48, x: '85vw', y: '25vh', dur: '22s' },
        { svg: '✏️', size: 40, x: '15vw', y: '70vh', dur: '20s' },
        { svg: '💻', size: 55, x: '80vw', y: '75vh', dur: '17s' }
      ];
      icons.forEach(icon => {
        const el = document.createElement('div');
        el.className = 'floating-icon';
        el.innerHTML = icon.svg;
        el.style.width = `${icon.size}px`;
        el.style.height = `${icon.size}px`;
        el.style.left = icon.x;
        el.style.top = icon.y;
        el.style.animation = `drift ${icon.dur} linear infinite`;
        bgContainer.appendChild(el);
      });
    }

    // Apply body class for styling
    document.body.classList.add('login-page');
    
    // Theme initialization
    const storedTheme = localStorage.getItem('pref-theme');
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }

    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address.' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      // TODO: Implement actual Appwrite password reset
      // await account.createRecovery(email, `${window.location.origin}/reset-password`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMessage({ 
        type: 'success', 
        text: 'Password reset link has been sent to your email!' 
      });
      setEmail('');
      
      // Optionally redirect after success
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Password reset failed:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to send reset link. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-shell pt-16">
      <div className="login-bg-layer" data-auth-bg aria-hidden="true">
        <div className="ambient-circle ambient-blue"></div>
        <div className="ambient-circle ambient-green"></div>
      </div>
      
      <div className="brand-lockup">
        <h1>Hub</h1>
        <p>Student Benefits Platform</p>
      </div>

      <div className="login-panel" role="form" aria-labelledby="forgotTitle">
        {/* Header with Icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <h2 id="forgotTitle" className="text-3xl font-medium text-gray-900 m-0">
            Forgot Password?
          </h2>
        </div>
        
        <p className="sub mb-8">
          Enter your email to reset your password.
        </p>

        {/* Message Display */}
        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              autoComplete="email"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="actions mt-6">
            <button
              type="submit"
              className="btn-login"
              disabled={isSubmitting}
              style={{
                background: isSubmitting 
                  ? '#94a3b8' 
                  : 'linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%)',
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>

          <div className="alt-actions mt-4">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors bg-transparent border-0 cursor-pointer"
            >
              Back to Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
