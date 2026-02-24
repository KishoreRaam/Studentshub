import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { GoogleIcon, SheerIDIcon } from './AuthIcons';
import './AuthStyles.css';

const SignInPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithGoogle, loginWithEmail, user, loading } = useAuth();
  const [formData, setFormData] = React.useState({ email: '', password: '' });
  const [error, setError] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  // Show OAuth error if redirected back with error param
  useEffect(() => {
    const oauthError = searchParams.get('error');
    if (oauthError === 'oauth_failed') {
      setError('Google sign-in failed. Please check that Google OAuth is enabled in Appwrite Console and try again.');
    }
  }, [searchParams]);

  // Redirect if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

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

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setSubmitting(true);
      await loginWithEmail(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
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
      <div className="login-panel" role="form" aria-labelledby="loginTitle">
        <h2 id="loginTitle">Sign in to your account</h2>
        <p className="sub">Access your dashboard</p>
        
        <div className="oauth-stack" aria-label="Third-party sign in options">
          <button type="button" className="oauth-btn google" onClick={handleGoogleLogin} disabled={loading}>
            <GoogleIcon />
            <span>{loading ? 'Loading...' : 'Continue with Google'}</span>
          </button>
          <div className="sheerid-block">
            <button type="button" className="oauth-btn sheerid">
              <SheerIDIcon />
              <span>Verify with SheerID</span>
            </button>
            <p className="sheerid-sub">Verify your student status instantly</p>
          </div>
        </div>

        <div className="oauth-divider" role="separator">
          <span>Or sign in with email</span>
        </div>

        {error && (
          <div className="error-message" style={{ 
            padding: '12px', 
            background: '#fee', 
            border: '1px solid #fcc', 
            borderRadius: '8px', 
            color: '#c33',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="you@university.edu" 
              autoComplete="email" 
              required
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              placeholder="••••••••" 
              autoComplete="current-password" 
              required
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <div className="actions">
            <button type="submit" className="btn-login" disabled={submitting || loading}>
              {submitting ? 'Signing In...' : 'Sign In →'}
            </button>
          </div>
          <div className="alt-actions">
            <div><a href="/forgot-password">Forgot password?</a></div>
            <div>Don't have an account? <a href="/signup">Create one</a></div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
