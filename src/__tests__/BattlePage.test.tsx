import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BattlePage } from '@/pages/BattlePage/BattlePage';

import * as progressService from '@/services/progress';

import '@/__mocks__/firebase';
import { render } from '@/test/test-utils';

// --- Mocks Setup ---

vi.useFakeTimers();

vi.mock('@/data/enemies.json', () => ({
  default: [
    {
      id: 'enemy-1',
      name: 'Dummy',
      stats: { health: 10 },
      difficulty: 'easy',
    },
  ],
}));

vi.mock('@/services/progress');

vi.mock('@/context/AuthContext', async importOriginal => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    useAuth: () => ({ isAuthenticated: true, user: { id: 'test-user' } }),
    AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// --- Helpers ---

function seedPlayer() {
  const player = {
    id: 'test-user',
    name: 'Player',
    level: 1,
    experience: 0,
    defeatedEnemies: [],
    stats: {},
    progress: { currentLevelId: '1', completedLevels: [] },
    inventory: { items: [], cards: [] },
  };
  localStorage.setItem('duelo_player_state_v1', JSON.stringify(player));
}

// --- Test Suite ---

describe('BattlePage', () => {
  beforeEach(() => {
    localStorage.clear();
    seedPlayer();
    vi.clearAllMocks();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.mocked(progressService.persistProgress).mockResolvedValue(undefined);
  });

  it(
    'awards experience and persists progress on victory',
    async () => {
      render(<BattlePage />);

      const cardButton = await screen.findByText(/Bug Fix/i);
      fireEvent.click(cardButton);

      vi.runAllTimers();

      await waitFor(() => {
        const storedPlayer = JSON.parse(
          localStorage.getItem('duelo_player_state_v1') || ''
        );
        expect(storedPlayer.experience).toBeGreaterThan(0);
      });

      await waitFor(() => {
        expect(progressService.persistProgress).toHaveBeenCalled();
      });
    },
    30000 // Increased timeout to 30s
  );
});
