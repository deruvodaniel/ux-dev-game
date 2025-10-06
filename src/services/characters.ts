import { firestore } from '@/services/firebase';

import type { Character } from '@/types';

export async function getCharacters(): Promise<Character[]> {
  const snapshot = await firestore.collection('characters').get();
  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || doc.id,
      avatar: data.avatarUrl, // Assumes avatarUrl is the public URL
      stats: data.stats ?? { hp: 100, attack: 10, defense: 10, speed: 50 },
      abilities: data.abilities ?? [],
    } as Character;
  });
}

export async function updateCharacterAvatar(
  characterId: string,
  avatarUrl: string,
): Promise<void> {
  await firestore.collection('characters').doc(characterId).update({ avatarUrl });
}
