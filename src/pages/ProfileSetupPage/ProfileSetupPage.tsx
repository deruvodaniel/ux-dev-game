/* eslint-disable simple-import-sort/imports */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import type { Player, Stats } from '@/types';

import { Button } from '@/components/atoms/Button/Button';
import { Heading, Text } from '@/components/atoms/Typography';
import { AvatarUploader } from '@/components/molecules/AvatarUploader/AvatarUploader';
import { StatDisplay } from '@/components/molecules/StatDisplay/StatDisplay';

import { useGame } from '@/context/GameContext';
import { usePlayersContext } from '@/context/PlayersContext';
import { useToast } from '@/context/ToastContext';

import { updatePlayerProfile } from '@/services/players';

import styles from './ProfileSetupPage.module.css';

export const ProfileSetupPage = () => {
  const { state: gameState, dispatch: gameDispatch } = useGame();
  const player = gameState.player;
  const navigate = useNavigate();
  const { notify } = useToast();
  const { t } = useTranslation();
  const { updatePlayer, syncing } = usePlayersContext();
  const userId = player?.id ?? null;

  // Component State
  const [email, setEmail] = useState<string>(player?.email ?? '');
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);

  // Effect to sync local email state if player context changes
  useEffect(() => {
    setEmail(player?.email ?? '');
  }, [player?.email]);

  const handleSaveProfile = async () => {
    if (!userId || !player) {
      notify({ message: t('profile.error.noUser'), level: 'danger' });
      return;
    }
    if (isSaving) return; // Prevent duplicate submissions

    setIsSaving(true);
    try {
      // This single function now handles avatar upload and Firestore update
      const newAvatarUrl = await updatePlayerProfile(userId, {
        name: player.name,
        email: email || null,
        avatarFile: selectedAvatarFile,
      });

      // Prepare payload for local context updates
      const updatedPlayerData: Partial<Player> = {
        name: player.name,
        email: email || null,
      };

      if (newAvatarUrl) {
        updatedPlayerData.avatarUrl = newAvatarUrl;
      }

      // Update the local GameContext which drives this page's UI
      gameDispatch({
        type: 'UPDATE_PLAYER_DATA',
        payload: updatedPlayerData,
      });

      // Update the global PlayersContext for other parts of the app (e.g., Ladder)
      updatePlayer(userId, updatedPlayerData);

      notify({
        message: t('profile.success.updated', 'Profile updated successfully.'),
        level: 'success',
      });

      navigate('/ladder');
    } catch (err: unknown) {
      const msg = (err as Error)?.message ?? String(err);
      notify({
        message: msg || t('profile.error.generic', 'Error updating profile.'),
        level: 'danger',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileSelected = (file: File) => {
    setSelectedAvatarFile(file);
  };

  const isSyncing = player?.id ? syncing(player.id) : false;

  return (
    <div className={styles.page}>
      <main className={styles.card}>
        <Heading level="h1" className={styles.title}>
          {t('profile.setup', 'Profile Setup')}
        </Heading>
        {isSyncing && (
          <div className={styles.syncing} aria-live="polite">
            {t('profile.syncing', 'Syncing profile...')}
          </div>
        )}
        <Text className={styles.subtitle}>
          {t(
            'profile.description',
            'Your digital identity represents your online presence and technical reputation. Upload an avatar to personalize it.',
          )}
        </Text>
        <div className={styles.row}>
          <label className={styles.label} htmlFor="name">
            {t('profile.name', 'Name')}
          </label>
          <input
            id="name"
            value={player?.name || ''}
            onChange={(e) =>
              gameDispatch({
                type: 'UPDATE_PLAYER_DATA',
                payload: { name: e.target.value },
              })
            }
            className={styles.input}
            placeholder={t('profile.name', 'Name')}
            disabled={isSaving}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.label}>
            {t('profile.avatar', 'Avatar')}
          </div>
          <AvatarUploader
            initialAvatar={player?.avatarUrl ?? null}
            initialLevel={player?.level || 1}
            onFileSelected={handleFileSelected}
            disabled={isSaving}
          />
        </div>
        <div className={styles.row}>
          <div className={styles.label}>
            {t('profile.initialStats', 'Initial Stats')}
          </div>
          <div className={styles.statsWrap}>
            <StatDisplay
              stats={
                (player?.stats as unknown as Stats) || {
                  soft_skills: 10,
                  tech_skills: 10,
                  core_values: 10,
                  creativity: 10,
                  ai_level: 1,
                }
              }
            />
          </div>
        </div>
        <div className={styles.actions}>
          <Button
            onClick={handleSaveProfile}
            ariaLabel={t(
              'profile.saveAndContinue',
              'Save and Continue',
            )}
            disabled={isSaving}
          >
            {isSaving
              ? t('profile.saving', 'Saving...')
              : t('profile.saveAndContinue', 'Save and Continue')}
          </Button>
        </div>
      </main>
    </div>
  );
};
