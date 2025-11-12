import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AuthProvider } from '@/context/AuthContext';
import { PlayersProvider, usePlayers } from '@/context/PlayersContext';
import * as playerService from '@/services/players';

// Mock the player service
vi.mock('@/services/players');

const TestComponent = () => {
  const { players, loading } = usePlayers();
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      {players.map(p => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
};

const mockUser = {
  id: 'test-user',
  name: 'Test User',
};

const mockAuthContext = {
  user: mockUser,
  isAuthenticated: true,
  loginWithRedirect: vi.fn(),
  logout: vi.fn(),
};

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => mockAuthContext,
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('PlayersContext', () => {
  it('performs a single fetch for multiple consumers', async () => {
    vi.mocked(playerService.fetchPlayers).mockResolvedValue([
      { id: '1', name: 'Player 1' } as any,
    ]);

    render(
      <AuthProvider>
        <PlayersProvider>
          <TestComponent />
          <TestComponent />
        </PlayersProvider>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByText('Player 1').length).toBe(2);
    });

    // fetchPlayers should only be called once
    expect(playerService.fetchPlayers).toHaveBeenCalledTimes(1);
  });
});
