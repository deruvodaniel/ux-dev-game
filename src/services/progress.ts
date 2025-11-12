import { doc, setDoc } from 'firebase/firestore';

import { db } from '@/services/firebase';

declare global {
  interface Window {
    __net?: { start?: () => void; end?: () => void };
  }
}

import type { Player } from '@/types';

// Persist experience, level and defeated enemies.
export async function persistProgress(player: Player): Promise<void> {
  try {
    window.__net?.start?.();
    if (!player.id) return;

    const playerRef = doc(db, 'players', player.id);

    const payload: {
      experience: number;
      level: number;
      defeatedEnemies: string[];
      stats?: Player['stats'];
    } = {
      experience: player.experience,
      level: player.level,
      defeatedEnemies: player.defeatedEnemies || [],
    };

    if (player.stats) {
      payload.stats = player.stats;
    }

    // Using setDoc with merge:true acts as an upsert for the specified fields.
    await setDoc(playerRef, payload, { merge: true });
  } catch (error) {
    console.warn('[progress] Failed to persist progress:', error);
    // silent
  } finally {
    window.__net?.end?.();
  }
}
