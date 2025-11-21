// Deprecated implementation replaced by context-backed hook.
// Kept for backward compatibility. Prefer usePlayersContext from PlayersContext.
import type { Player } from '@/types/player';

import { usePlayersContext } from '@/context/PlayersContext';

export const usePlayers = () => {
  const ctx = usePlayersContext();
  return {
    players: ctx.players,
    ladder: ctx.players, // ladder is same as players in new implementation
    loading: ctx.loading,
    error: ctx.error ? ctx.error.message : null,
    refresh: ctx.refreshLadder, // Map refreshLadder to refresh
    upsert: async (player: Player) => {
      ctx.upsertLocal(player);
      return player;
    },
  } as const;
};
