export type MediaHeight = 160 | 254 | 412 | 514 | 688 | 1080;
export type Link = { label: string; href: string };
export interface Copy {
  eyebrow?: string;
  heading?: string;
  body?: string[];
  cta?: Link;
  size?: 'standard' | 'editorial' | 'large';
}

export interface Heading {
  heading: string;
  eyebrow?: string;
  divider?: boolean;
  role?: 'display' | 'editorial' | 'card';
  narrow?: boolean;
}
export interface RelatedCard { title: string; tags: string; href: string }

export type Module =
  | ({ kind: 'heading' } & Heading)
  | ({ kind: 'text' } & Copy)
  | { kind: 'textGrid'; eyebrow?: string; columns: 1 | 2 | 3 | 4; items: Copy[] }
  | { kind: 'splitText'; label: string; copy: Copy }
  | { kind: 'media'; height: MediaHeight; bleed?: boolean }
  | { kind: 'mediaGrid'; height: MediaHeight; weights: number[]; inset?: boolean }
  | { kind: 'mediaStack'; heights: MediaHeight[]; compact?: boolean }
  | { kind: 'statement'; eyebrow?: string; text: string }
  | { kind: 'quote'; text: string; attribution?: string }
  | { kind: 'navigation'; heading: string; cards: RelatedCard[]; back: Link };
