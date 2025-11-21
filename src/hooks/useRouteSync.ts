import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { useGame } from '@/context/GameContext';
import { usePlayersContext } from '@/context/PlayersContext';
import { useMusicContext } from '@/hooks/useMusicContext';
import { fetchPlayerById } from '@/services/players';

export const useRouteSync = () => {
  const { state } = useGame();
  const { updatePlayer, refreshLadder } = usePlayersContext();
  const loc = useLocation();
  const lastPathRef = useRef<string | null>(null);

  // Hook para cambio automático de música según la ruta
  useMusicContext();

  useEffect(() => {
    // Avoid spamming refresh if parent re-renders without path change
    if (lastPathRef.current === loc.pathname) return;
    lastPathRef.current = loc.pathname;

    const run = async () => {
      if (state.player?.id) {
        // Manually sync player since it's not in context
        try {
          const p = await fetchPlayerById(state.player.id);
          if (p) {
            updatePlayer(state.player.id, p);
          }
        } catch (error) {
          console.error('Failed to sync player', error);
        }
      }
      // normal refresh (respects TTL) instead of forcing every time
      await refreshLadder(false);
    };
    void run();
  }, [loc.pathname, state.player?.id, updatePlayer, refreshLadder]);
};
