import type { PlayerCardProps } from '@/types/components-player-card';

import { Skeleton } from '@/components/atoms/Skeleton/Skeleton';
import { StatusBar } from '@/components/atoms/StatusBar/StatusBar';

import styles from './PlayerCard.module.css';

export const PlayerCard = ({
  name,
  avatarUrl,
  level = 1,
  health = 100,
  stamina = 100,
  isActive = false,
  variant = 'player',
  syncing = false,
}: PlayerCardProps & { syncing?: boolean }) => {
  if (syncing) {
    return (
      <div className={`${styles.card} ${styles.syncing}`} aria-busy>
        <div className={styles.top}>
          <div className={styles.avatar}>
            <Skeleton width={64} height={64} circle />
          </div>
          <div className={styles.info}>
            <Skeleton width={120} height={18} />
            <Skeleton width={80} height={14} />
          </div>
        </div>
        <div className={styles.bars}>
          <Skeleton width={180} height={12} />
          <Skeleton width={180} height={12} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.card} ${isActive ? styles.active : ''} ${variant === 'enemy' ? styles.enemy : ''}`}
    >
      <div className={styles.top}>
        <div className={styles.avatar}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${name} avatar`}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className={styles.placeholder}>
              {name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()}
            </div>
          )}
        </div>
        <div className={styles.info}>
          <div className={styles.name}>{name}</div>
          <div className={styles.level}>Nivel {level}</div>
        </div>
      </div>

      <div className={styles.bars}>
        <StatusBar label="Salud" current={health} max={100} color="green" />
        <StatusBar label="Stamina" current={stamina} max={100} color="blue" />
      </div>
    </div>
  );
};
