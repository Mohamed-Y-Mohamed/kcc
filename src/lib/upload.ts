import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export class UploadError extends Error {}

/**
 * Uploads to Firebase Storage and returns a public download URL.
 *
 * Storage has to be enabled on the Firebase project for this to work, which is
 * why every caller also accepts a pasted URL — the upload is the convenience,
 * not the only way in.
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new UploadError("Pick an image file (JPG, PNG or WebP).");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new UploadError(
      `That image is ${(file.size / 1024 / 1024).toFixed(1)}MB. Keep it under 5MB.`
    );
  }

  try {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${folder}/${Date.now()}-${safeName}`;
    const snap = await uploadBytes(ref(storage, path), file);
    return await getDownloadURL(snap.ref);
  } catch (err) {
    console.error("[KCC] Image upload failed:", err);
    throw new UploadError(
      "Upload failed. Enable Firebase Storage for this project, or paste an image URL instead."
    );
  }
}
