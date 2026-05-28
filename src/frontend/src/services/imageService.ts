import type { ExternalBlob } from "@/backend";
import { MAX_PHOTO_SIZE_MB, MAX_PROFILE_PHOTOS } from "@/constants";

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImage(file: File): ImageValidationResult {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as AllowedImageType)) {
    return {
      valid: false,
      error: "errors.unsupportedImageType",
    };
  }

  const maxBytes = MAX_PHOTO_SIZE_MB * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: "errors.imageTooBig",
    };
  }

  return { valid: true };
}

export function validatePhotoCount(current: number): boolean {
  return current < MAX_PROFILE_PHOTOS;
}

export function getImageUrl(blob: ExternalBlob): string {
  return blob.getDirectURL();
}

export function canAddMorePhotos(current: number): boolean {
  return current < MAX_PROFILE_PHOTOS;
}
