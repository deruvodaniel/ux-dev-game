import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { fetchPlayers, sortPlayersForLadder } from '@/services/players';

import { useAuth } from './AuthContext';

import type { Player } from '@/types';

// Definimos los tipos localmente ya que no existen en el barrel export
type PlayerId = string;
type PlayerWithId = Player & { id: string };

interface PlayersState {
  players: PlayerWithId[];
  loading: boolean;
  error: Error | null;
  inFlight: boolean;
  lastUpdated: number | null;
}

interface PlayersContextType extends PlayersState {
  refreshLadder: (force?: boolean) => Promise<void>;
  updatePlayer: (id: string, patch: Partial<Player>) => void;
  getPlayerById: (id: PlayerId) => PlayerWithId | undefined;
  upsertLocal: (player: Player) => void;
}

const PlayersContext = createContext<PlayersContextType | undefined>(undefined);

const initialState: PlayersState = {
  players: [], // Initialize as an empty array
  loading: true,
  error: null,
  inFlight: false,
  lastUpdated: null,
};

export const PlayersProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const [state, setState] = useState<PlayersState>(initialState);

  const refreshLadder = useCallback(
    async (force = false) => {
      if (state.inFlight) return;

      const now = Date.now();
      const stale = !state.lastUpdated || now - state.lastUpdated > 30000; // 30s TTL

      if (!stale && !force) return;

      setState((s) => ({ ...s, loading: true, inFlight: true }));

      try {
        const remotePlayers = await fetchPlayers();
        const sorted = sortPlayersForLadder(remotePlayers);

        setState((s) => ({
          ...s,
          players: sorted,
          loading: false,
          error: null,
          inFlight: false,
          lastUpdated: now,
        }));
      } catch (e) {
        setState((s) => ({
          ...s,
          error: e as Error,
          loading: false,
          inFlight: false,
        }));
      }
    },
    [state.inFlight, state.lastUpdated],
  );

  useEffect(() => {
    refreshLadder();
  }, [user?.id, refreshLadder]);

  const updatePlayer = useCallback((id: string, patch: Partial<Player>) => {
    setState((s) => {
      const idx = s.players.findIndex((p) => p.id === id);
      if (idx === -1) return s;

      const current = s.players[idx];
      const updated = { ...current, ...patch };
      const newPlayers = [...s.players];
      newPlayers[idx] = updated;

      return { ...s, players: newPlayers };
    });
  }, []);

  const getPlayerById = useCallback(
    (id: PlayerId) => {
      return state.players.find((p) => p.id === id);
    },
    [state.players],
  );

  const upsertLocal = useCallback((player: Player) => {
    setState((s) => {
      const idx = s.players.findIndex((p) => p.id === player.id);
      if (idx === -1) {
        // Add new player
        return { ...s, players: [...s.players, player] };
      }
      // Update existing player
      const newPlayers = [...s.players];
      newPlayers[idx] = player;
      return { ...s, players: newPlayers };
    });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      refreshLadder,
      updatePlayer,
      getPlayerById,
      upsertLocal,
    }),
    [state, refreshLadder, updatePlayer, getPlayerById, upsertLocal],
  );

  return (
    <PlayersContext.Provider value={value}>{children}</PlayersContext.Provider>
  );
};

export const usePlayers = () => {
  const context = useContext(PlayersContext);
  if (context === undefined) {
    throw new Error('usePlayers must be used within a PlayersProvider');
  }
  return context;
};

// Alias para compatibilidad
export const usePlayersContext = usePlayers;
