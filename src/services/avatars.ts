import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { auth, storage } from './firebase';

export async function publicAvatarUrlFor(
  path: string | null | undefined,
): Promise<string | null> {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;

  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    if (error instanceof Error && 'code' in error) {
      console.warn(
        `Could not get download URL for path "${path}":`,
        (error as { code: string }).code,
      );
    }
    return null;
  }
}

export async function uploadAvatar(file: File): Promise<string> {
  const currentUser = auth.currentUser;

  // --- START DIAGNOSTIC LOGGING ---
  console.log('--- Avatar Upload Diagnosis ---');
  if (currentUser) {
    console.log('Firebase Auth User is present.');
    console.log('auth.currentUser.uid:', currentUser.uid);
  } else {
    console.error('Firebase Auth User is NULL. Upload cannot proceed.');
    throw new Error('storage/unauthenticated');
  }
  // --- END DIAGNOSTIC LOGGING ---

  const userId = currentUser.uid; // Use the raw UID, do not sanitize
  const fileExt = (file.name.split('.').pop() || 'png').toLowerCase();
  const filePath = `avatars/${userId}/avatar.${fileExt}`;

  // --- START DIAGNOSTIC LOGGING ---
  console.log('Attempting to upload to path:', filePath);
  console.log('-----------------------------');
  // --- END DIAGNOSTIC LOGGING ---

  const fileRef = ref(storage, filePath);

  const metadata = {
    contentType: file.type,
    cacheControl: 'public, max-age=31536000',
  };

  try {
    await uploadBytes(fileRef, file, metadata);
    console.log('Upload successful!');
    return filePath;
  } catch (error) {
    console.error('Error during uploadBytes:', error);
    throw error;
  }
}
