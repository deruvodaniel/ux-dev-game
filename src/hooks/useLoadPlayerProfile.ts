import { useEffect, useRef, useState } from 'react';

import { useGame } from '@/context/GameContext';
import { fetchPlayerById } from '@/services/players';

import type { Player } from '@/types';

export const useLoadPlayerProfile = (userId: string | null | undefined) => {
  const { dispatch } = useGame();
  const [profile, setProfile] = useState<Player | null>(null);
  const [loading, setLoading] = useState(false);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!userId || loadedRef.current) return;
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const p = await fetchPlayerById(userId);
        if (!active) return;
        if (p) {
          setProfile(p);
          dispatch({
            type: 'UPDATE_PLAYER_DATA',
            payload: { name: p.name ?? '' },
          });
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    loadedRef.current = true;
    return () => {
      active = false;
    };
  }, [userId, dispatch]);

  return { profile, loading };
};
