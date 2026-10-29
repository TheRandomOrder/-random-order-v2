import projectContent from './content/projects.json';
import type {SourceReference} from './media';

export type Presentation = 'narrative' | 'gallery' | 'extended' | 'archive';

interface BlockBase { id?: string }
export interface TextBlock extends BlockBase { type: 'text'; label?: string; body: string | string[] }
export interface HeadingBlock extends BlockBase { type: 'heading'; title: string; eyebrow?: string; divider?: string }
export interface MediaBlock extends BlockBase { type: 'media'; mediaId: string; caption?: string; fullBleed?: boolean; width?: 'full' | 'narrow'; fit?: 'cover' | 'contain' }
export interface GalleryItem { mediaId: string; caption?: string; fit?: 'cover' | 'contain'; span?: number }
export interface GalleryBlock extends BlockBase { type: 'gallery'; items: (string | GalleryItem)[]; layout?: 'paired' | 'editorial' | 'dense' | 'triptych'; gap?: 'wide'; fullBleed?: boolean }
export interface FormulaBlock extends BlockBase { type: 'formula'; terms: {mediaId: string; label: string; operator?: string}[] }
export interface QuoteBlock extends BlockBase { type: 'quote'; quote: string; attribution?: string; role?: string }
export interface CreditsBlock extends BlockBase { type: 'credits'; items: {label: string; value: string; href?: string}[] }
export type EditorialBlock = TextBlock | HeadingBlock | MediaBlock | GalleryBlock | FormulaBlock | QuoteBlock | CreditsBlock;

export interface ProjectRecord {
  id: string;
  slug: string;
  title: string;
  presentation: Presentation;
  classification: 'featured' | 'archive' | 'unlisted';
  routeEnabled: boolean;
  status: 'draft' | 'ready' | 'published';
  featuredOrder?: number;
  homeOrder?: number;
  headerStyle?: 'plain' | 'image' | 'cinematic';
  cardNumber?: string;
  externalUrl?: string;
  client?: string;
  year?: string | number;
  disciplines: string[];
  intro?: string;
  description?: string;
  approach?: string;
  deliverables?: string[];
  outcomes?: string[];
  heroMediaId?: string;
  logoMediaId?: string;
  headerMediaId?: string;
  relatedIds?: string[];
  metadata?: {label: string; value: string}[];
  blocks: EditorialBlock[];
  sources?: SourceReference[];
}

/** Content is data; presentation and interaction live in reusable components. */
export const projects = projectContent as ProjectRecord[];

export function getProject(idOrSlug: string): ProjectRecord | undefined {
  return projects.find(project => project.id === idOrSlug || project.slug === idOrSlug);
}

export function projectHref(project: ProjectRecord): string | undefined {
  return project.routeEnabled ? `/work/${project.slug}/` : project.externalUrl;
}

export const featuredProjects = projects
  .filter(project => project.classification === 'featured')
  .sort((a, b) => (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999));

export const archiveProjects = projects.filter(project => project.classification === 'archive');

export function getRelatedProjects(project: ProjectRecord): ProjectRecord[] {
  return (project.relatedIds ?? []).flatMap(id => {
    const related = getProject(id);
    return related && related.id !== project.id && projectHref(related) ? [related] : [];
  });
}
