import * as Tooltip from '@radix-ui/react-tooltip';
import { badges, type BadgeType } from '@/data/community-data';
import { cn } from '@/lib/utils';
import styles from './BadgeDisplay.module.scss';

interface BadgeDisplayProps {
  badgeId: BadgeType;
  showLabel?: boolean;
}

export function BadgeDisplay({ badgeId, showLabel = false }: BadgeDisplayProps) {
  const badge = badges[badgeId];

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span className={cn(styles.badge, styles[badgeId])}>
            <span>{badge.icon}</span>
            {showLabel && <span>{badge.name}</span>}
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.tooltipContent} sideOffset={5}>
            <div className={styles.tooltipName}>{badge.name}</div>
            <div className={styles.tooltipDesc}>{badge.description}</div>
            <Tooltip.Arrow className={styles.tooltipArrow} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

interface BadgeShelfProps {
  badgeIds: BadgeType[];
}

export function BadgeShelf({ badgeIds }: BadgeShelfProps) {
  if (badgeIds.length === 0) return null;

  return (
    <div className={styles.shelf}>
      {badgeIds.map((badgeId) => (
        <BadgeDisplay key={badgeId} badgeId={badgeId} showLabel />
      ))}
    </div>
  );
}
