import { setDoc } from 'firebase/firestore';
import { describe, expect, it } from 'vitest';

import type { Player } from '@/types/player';

import { persistProgress } from '@/services/progress';

import '@/__mocks__/firebase'; // Import the global mock

// --- Test Suite ---

describe('persistProgress stats payload', () => {
  it('includes stats when present', async () => {
    const player: Player = {
      id: 'u1',
      name: 'P',
      level: 3,
      experience: 250,
      characters: [],
      inventory: { items: [], cards: [] },
      progress: { currentLevelId: '1', completedLevels: [] },
      stats: { battles_won: 4, damage_dealt: 500 },
      defeatedEnemies: ['e1', 'e2'],
    };

    await persistProgress(player);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...expectedPayload } = player;
    expect(setDoc).toHaveBeenCalledWith(expect.anything(), expectedPayload, {
      merge: true,
    });
  }, 10000);
});
