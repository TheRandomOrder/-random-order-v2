import projectContent from './content/projects.json';
import type {SourceReference} from './media';

export type Presentation = 'narrative' | 'gallery' | 'extended' | 'archive';

interface BlockBase { id?: string; spaceBefore?: number }
export interface TextBlock extends BlockBase { type: 'text'; label?: string; body: string | string[] }
export interface HeadingBlock extends BlockBase { type: 'heading'; title: string; eyebrow?: string; divider?: string }
export interface MediaBlock extends BlockBase { type: 'media'; mediaId: string; caption?: string; fullBleed?: boolean; width?: 'full' | 'narrow'; fit?: 'cover' | 'contain' }
export interface GalleryItem { mediaId: string; caption?: string; fit?: 'cover' | 'contain'; span?: number }
export interface GalleryBlock extends BlockBase { type: 'gallery'; items: (string | GalleryItem)[]; layout?: 'paired' | 'editorial' | 'dense' | 'triptych'; gap?: 'wide'; fullBleed?: boolean; columns?: number[]; columnGap?: number; maxWidth?: number }
export interface PaletteBlock extends BlockBase { type: 'palette'; label: string; colors: {value: string; name: string}[]; columns?: number }
export interface FormulaBlock extends BlockBase { type: 'formula'; terms: {mediaId: string; label: string; operator?: string}[] }
export interface QuoteBlock extends BlockBase { type: 'quote'; quote: string; attribution?: string; role?: string }
export interface CreditsBlock extends BlockBase { type: 'credits'; items: {label: string; value: string; href?: string}[] }
export type EditorialBlock = TextBlock | HeadingBlock | MediaBlock | GalleryBlock | FormulaBlock | QuoteBlock | CreditsBlock | PaletteBlock;

export interface ProjectRecord {
  sourceComposition?: string;
  id: string;
  slug: string;
  title: string;
  presentation: Presentation;
  mode?: 'case-study' | 'visual-story';
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
  category?: string;
  intro?: string;
  description?: string;
  approach?: string;
  deliverables?: string[];
  outcomes?: string[];
  heroMediaId?: string;
  logoMediaId?: string;
  headerMediaId?: string;
  headerCaption?: string;
  headerHeight?: number;
  headerTop?: number;
  headerTitleScale?: 'large';
  headerOpacity?: number;
  headerMonochrome?: boolean;
  editorialTop?: number;
  relatedIds?: string[];
  navigation?: 'related';
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

/** The index and case-study navigation share one explicit editorial order. */
const workOrder = ['publicis-machine', 'ssuperlative', 'golds-gym', 'muso', 'hotel-atelier', 'hallys', 'cozy', 'superbalist', 'adidas', 'sneaker-lab', 'earnt', 'sussex', 'tfb', 'wright', 'ham', 'scottusa', 'gadventures', 'brandmarks', 'random-projects', 'the-shed', 'orchard-on-long'];
export const workIndexProjects = workOrder.flatMap(id => {
  const project = getProject(id);
  return project?.routeEnabled ? [project] : [];
});
