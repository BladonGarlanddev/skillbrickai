import { Coins } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button/Button';
import { useAuthStore } from '@/stores/auth.store';
import api from '@/lib/api';
import styles from './TokenPanel.module.scss';

interface TokenTransaction {
  id: string;
  type: string;
  amount: number;
  reason: string;
  createdAt: string;
}

export function TokenPanel() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data: balance } = useQuery({
    queryKey: ['token-balance'],
    queryFn: async (): Promise<number> => {
      const { data } = await api.get('/tokens/balance');
      return data.balance ?? data.tokenBalance ?? 0;
    },
    enabled: isAuthenticated,
  });

  const { data: history } = useQuery({
    queryKey: ['token-history'],
    queryFn: async (): Promise<TokenTransaction[]> => {
      const { data } = await api.get('/tokens/history');
      return data as TokenTransaction[];
    },
    enabled: isAuthenticated,
  });

  const tokens = balance ?? 0;
  const transactions = history ?? [];

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="ghost" size="sm">
          <Coins style={{ width: '1rem', height: '1rem' }} />
          <span>{tokens}</span>
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className={styles.content} align="end" sideOffset={8}>
          <div className={styles.balance}>
            <div className={styles.balanceLabel}>Token Balance</div>
            <div className={styles.balanceValue}>{tokens}</div>
          </div>

          <div className={styles.earning}>
            <div className={styles.sectionTitle}>How to Earn More</div>
            <div className={styles.earningList}>
              <div className={styles.earningItem}>
                <span>Post a skill</span>
                <span className={styles.earningAmount}>+10</span>
              </div>
              <div className={styles.earningItem}>
                <span>Create an account</span>
                <span className={styles.earningAmount}>+30</span>
              </div>
            </div>
          </div>

          <div className={styles.activity}>
            <div className={styles.sectionTitle}>Recent Activity</div>
            <div className={styles.activityList}>
              {transactions.slice(0, 3).map(transaction => (
                <div key={transaction.id} className={styles.activityItem}>
                  <div className={styles.activityInfo}>
                    <div className={styles.activityDesc}>{transaction.reason}</div>
                    <div className={styles.activityDate}>
                      {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <div className={transaction.amount > 0 ? styles.earn : styles.spend}>
                    {transaction.amount > 0 ? '+' : '\u2212'}
                    {Math.abs(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Popover.Arrow className={styles.arrow} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
