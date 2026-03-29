import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      navigate('/auth');
      return;
    }

    try {
      // Decode JWT payload (base64url) to get user info
      const payload = JSON.parse(atob(token.split('.')[1]));
      login(
        { id: payload.sub, email: payload.email, username: payload.email.split('@')[0] },
        token,
      );
      navigate('/', { replace: true });
    } catch {
      navigate('/auth');
    }
  }, [searchParams, navigate, login]);

  return <div style={{ padding: '2rem', textAlign: 'center' }}>Signing you in...</div>;
}
