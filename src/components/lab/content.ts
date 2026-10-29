import {getMedia, type MediaAsset} from '../../data/media';

/** Curated references only. Media files, dimensions and provenance stay in the canonical registry. */
export const goldStudyIds = ['golds-strength', 'golds-bar', 'golds-press', 'golds-rope', 'golds-composite'];
export const selectedStudyIds = ['hallys-poster', 'earnt-poster', 'shed-photo'];
export const goldStudies = () => goldStudyIds.map(getMedia);
export const archiveStudies = () => [...goldStudyIds, ...selectedStudyIds, 'hallys-film'].map(getMedia);
export const flashStudies = () => [
  'golds-strength', 'hallys-poster', 'golds-bar', 'earnt-poster',
  'golds-press', 'shed-photo', 'golds-rope',
].map(getMedia);

export function studyLabel(media: MediaAsset): string {
  if (media.id.startsWith('golds-')) return 'Gold’s Gym';
  if (media.id.startsWith('hallys-')) return 'Hally’s';
  if (media.id.startsWith('earnt-')) return 'EARNT';
  if (media.id.startsWith('shed-')) return 'The Shed';
  return media.caption ?? 'Selected work';
}

export function studyContext(media: MediaAsset): string {
  if (media.id.startsWith('golds-')) return 'AI image study';
  return media.type === 'video' ? 'Brand film' : 'Selected project imagery';
}

export const studyCollection = (media: MediaAsset): 'golds' | 'selected' => media.id.startsWith('golds-') ? 'golds' : 'selected';
