import { Link, useLocation } from 'react-router-dom';
import { Search, User } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { TokenPanel } from '@/components/TokenPanel/TokenPanel';
import { useAuthStore } from '@/stores/auth.store';
import styles from './Header.module.scss';

export function Header() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <div className={styles.logoMark}>
            <div className={styles.brick} />
            <div className={styles.brickRow}>
              <div className={styles.brickHalf} />
              <div className={styles.brickHalf} />
            </div>
          </div>
          <span className={styles.logoText}>SkillBrick AI</span>
        </Link>

        <nav className={styles.nav}>
          <Link to="/browse">
            <Button
              variant={location.pathname === '/browse' ? 'secondary' : 'ghost'}
              size="sm"
            >
              Browse
            </Button>
          </Link>
          <Link to="/community">
            <Button
              variant={location.pathname.startsWith('/community') ? 'secondary' : 'ghost'}
              size="sm"
            >
              Community
            </Button>
          </Link>
          <Link to="/submit">
            <Button
              variant={location.pathname === '/submit' ? 'secondary' : 'ghost'}
              size="sm"
            >
              Contribute
            </Button>
          </Link>
        </nav>

        <div className={styles.actions}>
          <Link to="/browse">
            <Button variant="ghost" size="icon">
              <Search style={{ width: '1rem', height: '1rem' }} />
            </Button>
          </Link>

          {isAuthenticated && user ? (
            <>
              <TokenPanel />
              <Link to={`/profile/${user.id}`}>
                <Button variant="ghost" size="icon">
                  <User style={{ width: '1rem', height: '1rem' }} />
                </Button>
              </Link>
            </>
          ) : (
            <Link to="/auth">
              <Button size="sm">Log In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
