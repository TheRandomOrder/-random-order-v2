import type { SiteNavigation } from '../data/site-navigation';
import phones from './assets/superbalist-phones.jpg';
import wide from './assets/superbalist-wide.jpg';

const index = '/dev/templates/';
export const routes = { index, home: index + 'home/', work: index + 'work/', detail: index + 'superbalist/' };
export const navigation: SiteNavigation = {
  home: routes.home, index, contact: routes.home + '#contact',
  links: [
    { label: 'Work', href: routes.work }, { label: 'Magazine' }, { label: 'About' },
    { label: 'Contact', href: routes.home + '#contact' },
  ],
};
const superbalist = {
  id: 'superbalist', title: 'Superbalist', category: 'Product design / Visual systems',
  description: 'A mobile shopping experience bringing fashion, beauty and a flexible brand language together.',
  image: phones.src, href: routes.detail,
};
const bagmee = {
  id: 'bagmee', title: 'BAGMEE', category: 'Identity / Packaging',
  description: 'A geometric bag symbol and understated wordmark, brought together on circular tags.',
  image: '/assets/work-a/bagme-tags.jpg', unavailable: 'Detail outside this prototype',
};
const emptyCards = Array.from({ length: 4 }, (_, i) => ({
  id: 'slot-' + (i + 1), title: 'TITLE', category: 'Placeholder',
}));
export const homeCards = [superbalist, bagmee, ...emptyCards.slice(0, 3)];
export const workCards = [bagmee, superbalist, ...emptyCards];
export const furtherCards = emptyCards.map(card => ({ title: card.title, tags: card.category }));
export const slides = [
  { title: superbalist.title, headline: 'The way of us', image: wide.src, href: routes.detail, durationMs: 8000 },
  { title: bagmee.title, headline: bagmee.title, image: bagmee.image, unavailable: bagmee.unavailable, durationMs: 9000 },
];
