import { collection, doc, getDoc, getDocs, getFirestore, setDoc } from 'firebase/firestore';

import type { Player } from '@/types';

const db = getFirestore();
const playersCollectionRef = collection(db, 'players');

/**
 * Ensures a player record exists in the remote database.
 * If the user is new, it creates a default player document.
 * @param user - The authenticated user.
 * @returns The player data.
 */
export const ensureRemotePlayerRecord = async (
  user: { id: string; name?: string | null; picture?: string | null },
): Promise<Player> => {
  const playerDocRef = doc(db, 'players', user.id);
  const playerDoc = await getDoc(playerDocRef);

  if (playerDoc.exists()) {
    return playerDoc.data() as Player;
  }

  const newPlayer: Player = {
    id: user.id,
    name: user.name || 'New Player',
    level: 1,
    experience: 0,
    characters: [],
    inventory: { items: [], cards: [] },
    progress: { currentLevelId: '1', completedLevels: [] },
    stats: { battles_won: 0, battles_lost: 0, damage_dealt: 0 },
    avatarUrl: user.picture,
    defeatedEnemies: [],
  };

  await setDoc(playerDocRef, newPlayer);
  return newPlayer;
};

/**
 * Fetches a player by their ID.
 * @param playerId - The ID of the player to fetch.
 * @returns The player data or null if not found.
 */
export const fetchPlayerById = async (playerId: string): Promise<Player | null> => {
  const playerDocRef = doc(db, 'players', playerId);
  const playerDoc = await getDoc(playerDocRef);
  return playerDoc.exists() ? (playerDoc.data() as Player) : null;
};

/**
 * Fetches all players from the remote database.
 * @returns A promise that resolves to an array of players.
 */
export const fetchPlayers = async (): Promise<Player[]> => {
  const snapshot = await getDocs(playersCollectionRef);
  const players: Player[] = [];
  snapshot.forEach(doc => {
    // FIX: Manually add the document ID to the player object
    players.push({ id: doc.id, ...doc.data() } as Player);
  });
  return players;
};

/**
 * Sorts players for the ladder view.
 * - Higher level first
 * - Higher experience first
 * - Alphabetical name as a tie-breaker
 * @param players - The array of players to sort.
 * @returns The sorted array of players.
 */
export const sortPlayersForLadder = (players: Player[]): Player[] => {
  return players.sort((a, b) => {
    if (b.level !== a.level) return b.level - a.level;
    if (b.experience !== a.experience) return b.experience - a.experience;
    return a.name.localeCompare(b.name);
  });
};

/**
 * Updates the player's entire profile (e.g., after a game session).
 * @param player - The player object with updated data.
 */
export const savePlayer = async (player: Player): Promise<void> => {
  const playerDocRef = doc(db, 'players', player.id);
  await setDoc(playerDocRef, player, { merge: true });
};

/**
 * Specifically updates a player's name and other profile details.
 * @param player - Partial player data including ID.
 */
export const updatePlayerProfile = async (
  player: Pick<Player, 'id'> & Partial<Player>
): Promise<void> => {
  const playerDocRef = doc(db, 'players', player.id);
  await setDoc(playerDocRef, player, { merge: true });
};

/**
 * Specifically updates the player's avatar URL.
 * @param userId - The user's ID.
 * @param avatarUrl - The new public URL of the avatar.
 */
export const updatePlayerAvatar = async (
  userId: string,
  avatarUrl: string
): Promise<void> => {
  const playerDocRef = doc(db, 'players', userId);
  await setDoc(playerDocRef, { avatarUrl }, { merge: true });
};
