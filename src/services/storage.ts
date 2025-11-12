import { storage } from './firebase';

/**
 * Uploads a file to Firebase Storage and returns the public URL.
 *
 * @param file The file to upload.
 * @param userId The user ID to associate the file with.
 * @returns The public URL of the uploaded file.
 */
export const uploadAvatar = async (
  file: File,
  userId: string,
): Promise<string> => {
  const filePath = `avatars/${userId}/${file.name}`;
  const storageRef = storage.ref();
  const fileRef = storageRef.child(filePath);

  await fileRef.put(file);
  const url = await fileRef.getDownloadURL();

  return url;
};
