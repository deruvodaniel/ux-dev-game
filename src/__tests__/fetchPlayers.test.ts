import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Player } from '@/types/player';

import { fetchPlayers, sortPlayersForLadder } from '@/services/players';
import { getDocs } from 'firebase/firestore';
import '@/__mocks__/firebase'; // Import the global mock

// --- Test Suite ---

describe('fetchPlayers + ladder mapping', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty array when firestore call returns no players', async () => {
    (getDocs as vi.Mock).mockResolvedValue({ docs: [], forEach: (cb: any) => {} });

    const players = await fetchPlayers();
    expect(players).toEqual([]);
  });

  it('returns a list of players from firestore, including the ID', async () => {
    const mockData = [
      { id: 'p1', data: () => ({ name: 'Player One', level: 10, experience: 1000 }) },
      { id: 'p2', data: () => ({ name: 'Player Two', level: 8, experience: 800 }) },
    ];
    const mockSnapshot = {
      docs: mockData,
      forEach: (callback: (d: any) => void) => mockData.forEach(callback),
    };
    (getDocs as vi.Mock).mockResolvedValue(mockSnapshot);

    const players = await fetchPlayers();
    expect(players.length).toBe(2);
    expect(players[0].name).toBe('Player One');
    expect(players[0].id).toBe('p1'); // This should now pass
  });

  it('sortPlayersForLadder orders by level then experience', () => {
    const ordered = sortPlayersForLadder([
      { id: '1', name: 'A', level: 2, experience: 10 },
      { id: '2', name: 'B', level: 3, experience: 5 },
      { id: '3', name: 'C', level: 3, experience: 20 },
    ] as Player[]);
    expect(ordered.map(p => p.id)).toEqual(['3', '2', '1']);
  });
});
