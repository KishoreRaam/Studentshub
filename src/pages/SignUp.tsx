import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GoogleIcon, SheerIDIcon } from './Login/AuthIcons';
import './Login/AuthStyles.css';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, signupWithEmail, user, loading } = useAuth();
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    institution: '',
    email: '',
    password: '',
    confirm: '',
    terms: false
  });
  const [error, setError] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

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
    document.body.classList.add('signup-page');
    // Theme initialization
    const storedTheme = localStorage.getItem('pref-theme');
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }

    return () => {
      document.body.classList.remove('signup-page');
    };
  }, []);

  const handleGoogleSignUp = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Sign up failed:', error);
      alert('Sign up failed. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.firstName || !formData.lastName) {
      setError('Please enter your full name');
      return;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (formData.password !== formData.confirm) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.terms) {
      setError('You must agree to the Terms & Privacy Policy');
      return;
    }

    try {
      setSubmitting(true);
      const fullName = `${formData.firstName} ${formData.lastName}`;
      await signupWithEmail(formData.email, formData.password, fullName);
      
      // Redirect to verify email page
      navigate('/verify-email');
    } catch (error: any) {
      console.error('Signup failed:', error);
      setError(error.message || 'Signup failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-layout pt-16">
      <div className="auth-left">
        <div className="brand-lockup">
          <h1>Hub</h1>
          <p>Student Benefits Platform</p>
        </div>
        <div className="signup-panel" role="form" aria-labelledby="signupTitle">
          <h2 id="signupTitle">Create your account</h2>
          <p className="sub">Start saving today</p>
          
          <div className="oauth-stack" aria-label="Third-party sign up options">
            <button type="button" className="oauth-btn google" onClick={handleGoogleSignUp} disabled={loading}>
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
            <span>Or sign up with email</span>
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

          <form id="signupForm" className="signup-form" onSubmit={handleSubmit} noValidate>
            <div className="field-row">
              <div className="field">
                <label htmlFor="firstName">First Name</label>
                <input 
                  id="firstName" 
                  name="firstName" 
                  required 
                  placeholder="Jane" 
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="field">
                <label htmlFor="lastName">Last Name</label>
                <input 
                  id="lastName" 
                  name="lastName" 
                  required 
                  placeholder="Doe" 
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="institution">Institution</label>
              <input 
                id="institution" 
                name="institution" 
                required 
                placeholder="University / College" 
                autoComplete="organization"
                value={formData.institution}
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="email">Academic Email</label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                required 
                placeholder="you@university.edu" 
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="password">Password</label>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  minLength={8} 
                  placeholder="••••••••" 
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="field">
                <label htmlFor="confirm">Confirm Password</label>
                <input 
                  id="confirm" 
                  name="confirm" 
                  type="password" 
                  required 
                  minLength={8} 
                  placeholder="••••••••" 
                  autoComplete="new-password"
                  value={formData.confirm}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <label className="inline">
              <input 
                type="checkbox" 
                id="terms" 
                name="terms"
                required
                checked={formData.terms}
                onChange={handleInputChange}
              />
              <span>I agree to the <a href="#">Terms</a> & <a href="#">Privacy Policy</a>.</span>
            </label>
            <div className="actions">
              <button type="submit" className="btn-create" disabled={submitting || loading}>
                {submitting ? 'Creating Account...' : 'Create Account →'}
              </button>
            </div>
            <div className="alt-actions">
              Already have an account? <a href="/login">Sign in</a>
            </div>
          </form>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-bg-layer" data-auth-bg aria-hidden="true">
          <div className="ambient-circle ambient-blue"></div>
          <div className="ambient-circle ambient-green"></div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
