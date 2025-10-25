import React, { useEffect } from 'react';
import { GoogleIcon, SheerIDIcon } from './AuthIcons';
import './AuthStyles.css';

const SignInPage = () => {
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
          <button type="button" className="oauth-btn google">
            <GoogleIcon />
            <span>Continue with Google</span>
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

        <form className="login-form" noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="you@university.edu" autoComplete="email" required />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="••••••••" autoComplete="current-password" required />
          </div>
          <div className="actions">
            <button type="submit" className="btn-login">Sign In →</button>
          </div>
          <div className="alt-actions">
            <div><a href="#">Forgot password?</a></div>
            <div>Don't have an account? <a href="/signup">Create one</a></div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
