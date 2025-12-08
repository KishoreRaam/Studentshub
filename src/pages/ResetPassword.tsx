import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import './Login/AuthStyles.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

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

  // Calculate password strength
  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    setPasswordStrength(Math.min(strength, 4));
  }, [password]);

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return '#ef4444';
    if (passwordStrength === 2) return '#f59e0b';
    if (passwordStrength === 3) return '#3b82f6';
    return '#10b981';
  };

  const getStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength === 2) return 'Fair';
    if (passwordStrength === 3) return 'Good';
    return 'Strong';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }

    if (password.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      // Get reset parameters from URL
      const userId = searchParams.get('userId');
      const secret = searchParams.get('secret');

      if (!userId || !secret) {
        throw new Error('Invalid reset link');
      }

      // TODO: Implement actual Appwrite password reset
      // await account.updateRecovery(userId, secret, password, confirmPassword);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMessage({ 
        type: 'success', 
        text: 'Password reset successfully! Redirecting to login...' 
      });
      
      // Redirect to login after success
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Password reset failed:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to reset password. The link may have expired.' 
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

      <div className="login-panel" role="form" aria-labelledby="resetTitle">
        {/* Header with Icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <h2 id="resetTitle" className="text-3xl font-medium text-gray-900 m-0">
            Reset Password
          </h2>
        </div>
        
        <p className="sub mb-8">
          Enter your new password below.
        </p>

        {/* Message Display */}
        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm flex items-start gap-2 ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.type === 'success' && <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {/* New Password Field */}
          <div className="field">
            <label htmlFor="password">New Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                autoComplete="new-password"
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 bg-transparent border-0 cursor-pointer p-1"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: passwordStrength >= level ? getStrengthColor() : '#e5e7eb'
                      }}
                    />
                  ))}
                </div>
                {passwordStrength > 0 && (
                  <p className="text-xs mt-1" style={{ color: getStrengthColor() }}>
                    {getStrengthText()}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                autoComplete="new-password"
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 bg-transparent border-0 cursor-pointer p-1"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {/* Match Indicator */}
            {confirmPassword && (
              <p
                className={`text-xs mt-1 ${
                  password === confirmPassword ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 font-medium mb-2">Password must contain:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className={password.length >= 8 ? 'text-green-600' : ''}>
                {password.length >= 8 ? '✓' : '•'} At least 8 characters
              </li>
              <li className={/[a-z]/.test(password) && /[A-Z]/.test(password) ? 'text-green-600' : ''}>
                {/[a-z]/.test(password) && /[A-Z]/.test(password) ? '✓' : '•'} Upper and lowercase letters
              </li>
              <li className={/\d/.test(password) ? 'text-green-600' : ''}>
                {/\d/.test(password) ? '✓' : '•'} At least one number
              </li>
              <li className={/[^a-zA-Z0-9]/.test(password) ? 'text-green-600' : ''}>
                {/[^a-zA-Z0-9]/.test(password) ? '✓' : '•'} At least one special character
              </li>
            </ul>
          </div>

          <div className="actions">
            <button
              type="submit"
              className="btn-login"
              disabled={isSubmitting || !password || !confirmPassword || password !== confirmPassword}
              style={{
                background: (isSubmitting || !password || !confirmPassword || password !== confirmPassword)
                  ? '#94a3b8' 
                  : 'linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%)',
                cursor: (isSubmitting || !password || !confirmPassword || password !== confirmPassword)
                  ? 'not-allowed' 
                  : 'pointer'
              }}
            >
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;
