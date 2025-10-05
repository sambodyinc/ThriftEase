
// This file is now deprecated as images are handled by direct URLs from Firebase Storage.
// It is kept for reference but is no longer used by the application components.
// You may safely remove this file and its references if you wish.

import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const PlaceHolderImages: ImagePlaceholder[] = (data as any).placeholderImages || [];
