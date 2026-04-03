import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Github } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { useAuthStore } from '@/stores/auth.store';
import api from '@/lib/api';
import styles from './AuthPage.module.scss';

export default function AuthPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { data } = await api.post('/auth/register', { email, password, username });
        login(data.user, data.accessToken);
      } else {
        const { data } = await api.post('/auth/login', { email, password });
        login(data.user, data.accessToken);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || '/api';
    window.location.href = `${apiUrl}/auth/${provider.toLowerCase()}`;
  };

  return (
    <div className={styles.page}>
      {/* Constellation background */}
      <div className={styles.constellation}>
        <svg viewBox="0 0 800 600" className={styles.constellationSvg}>
          <g stroke="currentColor" strokeWidth="0.5" fill="none">
            <line x1="100" y1="100" x2="200" y2="150" />
            <line x1="200" y1="150" x2="300" y2="120" />
            <line x1="300" y1="120" x2="400" y2="180" />
            <line x1="200" y1="150" x2="250" y2="250" />
            <line x1="250" y1="250" x2="350" y2="280" />
            <line x1="350" y1="280" x2="400" y2="180" />
            <line x1="500" y1="200" x2="600" y2="180" />
            <line x1="600" y1="180" x2="650" y2="250" />
            <line x1="500" y1="200" x2="550" y2="300" />
            <line x1="550" y1="300" x2="650" y2="250" />
          </g>
          <g fill="currentColor">
            <circle cx="100" cy="100" r="2" />
            <circle cx="200" cy="150" r="2.5" />
            <circle cx="300" cy="120" r="2" />
            <circle cx="400" cy="180" r="2.5" />
            <circle cx="250" cy="250" r="2" />
            <circle cx="350" cy="280" r="2" />
            <circle cx="500" cy="200" r="2.5" />
            <circle cx="600" cy="180" r="2" />
            <circle cx="650" cy="250" r="2" />
            <circle cx="550" cy="300" r="2" />
          </g>
        </svg>
      </div>

      <div className={styles.card}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg viewBox="0 0 32 32">
              <g stroke="currentColor" strokeWidth="1" fill="none">
                <line x1="8" y1="16" x2="16" y2="8" />
                <line x1="16" y1="8" x2="24" y2="16" />
                <line x1="8" y1="16" x2="16" y2="24" />
                <line x1="16" y1="24" x2="24" y2="16" />
              </g>
              <g fill="currentColor">
                <circle cx="8" cy="16" r="2" />
                <circle cx="24" cy="16" r="2" />
                <circle cx="16" cy="8" r="2" />
                <circle cx="16" cy="24" r="2" />
              </g>
            </svg>
          </div>
          <span className={styles.logoText}>SkillBrick AI</span>
        </Link>

        {/* Header */}
        <div className={styles.headerText}>
          <h1 className={styles.title}>
            {mode === 'signup' ? 'Join SkillBrick AI' : 'Welcome back'}
          </h1>
          <p className={styles.subtitle}>
            {mode === 'signup'
              ? 'Start building and sharing AI skills with the community'
              : 'Continue your journey with SkillBrick AI'}
          </p>
        </div>

        {/* Early Adopter Incentive */}
        {mode === 'signup' && (
          <div className={styles.incentive}>
            <div className={styles.incentiveInner}>
              <div className={styles.earlyAdopterBadge}>
                <span>{'\u2726'}</span>
                <span>Early Adopter</span>
              </div>
              <div className={styles.incentiveText}>Start with 30 free installs</div>
            </div>
          </div>
        )}

        {/* OAuth Buttons */}
        <div className={styles.oauthButtons}>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOAuth('GitHub')}
            className={styles.oauthButton}
          >
            <Github style={{ width: '1rem', height: '1rem' }} />
            Continue with GitHub
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOAuth('Google')}
            className={styles.oauthButton}
          >
            <svg style={{ width: '1rem', height: '1rem' }} viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </Button>
        </div>

        {/* Divider */}
        <div className={styles.divider}>
          <div className={styles.dividerLine} />
          <span className={styles.dividerText}>or continue with email</span>
          <div className={styles.dividerLine} />
        </div>

        {/* Error */}
        {error && <div style={{ color: 'red', fontSize: '0.875rem', textAlign: 'center' }}>{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {mode === 'signup' && (
            <div className={styles.field}>
              <label htmlFor="username" className={styles.label}>Username</label>
              <Input
                id="username"
                type="text"
                placeholder="janedoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <Input
              id="password"
              type="password"
              placeholder={'\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {mode === 'signup' && (
              <p className={styles.fieldHint}>At least 8 characters</p>
            )}
          </div>

          {mode === 'login' && (
            <div className={styles.forgotPassword}>
              <button type="button">Forgot password?</button>
            </div>
          )}

          <Button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Create Account'}
          </Button>
        </form>

        {/* Mode Toggle */}
        <div className={styles.modeToggle}>
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button type="button" onClick={() => { setMode('signup'); setError(''); }}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => { setMode('login'); setError(''); }}>
                Log in
              </button>
            </>
          )}
        </div>

        {/* Terms */}
        {mode === 'signup' && (
          <p className={styles.terms}>
            By creating an account, you agree to our{' '}
            <a href="#">Terms of Service</a> and{' '}
            <a href="#">Privacy Policy</a>
          </p>
        )}
      </div>
    </div>
  );
}
