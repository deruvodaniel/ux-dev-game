import { useTranslation } from 'react-i18next';

import styles from './WinLossCounter.module.css';

import type { WinLossCounterProps } from '@/types';

export const WinLossCounter = ({ wins, losses }: WinLossCounterProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.counter} data-testid="win-loss-counter">
      <span className={styles.wins}>{t('stats.wins')}: {wins}</span>
      <span className={styles.losses}>{t('stats.losses')}: {losses}</span>
    </div>
  );
};
