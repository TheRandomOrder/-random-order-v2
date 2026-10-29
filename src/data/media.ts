import mediaContent from './content/media.json';

export interface SourceReference {
  label: string;
  url?: string;
  nodeId?: string;
}

export interface MediaVariant {
  src: string;
  width: number;
}

export interface MediaAsset {
  id: string;
  type: 'image' | 'video';
  src: string;
  width: number;
  height: number;
  alt: string;
  poster?: string;
  variants?: MediaVariant[];
  fit?: 'cover' | 'contain';
  position?: string;
  aspectRatio?: string;
  caption?: string;
  credit?: string;
  source?: SourceReference;
  motion?: {
    autoplay?: 'viewport' | 'manual';
    loop?: boolean;
  };
}

/** Stable media IDs let the same artwork serve a case study, index and experiment. */
export const mediaAssets = mediaContent as MediaAsset[];

export function getMedia(id: string): MediaAsset {
  const asset = mediaAssets.find(media => media.id === id);
  if (!asset) throw new Error(`Unknown project media: ${id}`);
  return asset;
}

export function imageSourceSet(asset: MediaAsset): string | undefined {
  if (asset.type !== 'image' || !asset.variants?.length) return undefined;
  const candidates = [...asset.variants, {src: asset.src, width: asset.width}];
  return [...new Map(candidates.map(item => [item.width, item])).values()]
    .sort((a, b) => a.width - b.width)
    .map(item => `${item.src} ${item.width}w`).join(', ');
}
