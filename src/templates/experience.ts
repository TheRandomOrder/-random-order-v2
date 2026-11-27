import type { SiteNavigation } from '../data/site-navigation';
import phones from './assets/superbalist-phones.jpg';

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
  image: '/assets/work-a/bagme-tags.jpg',
};
const emptyCards = [
  { title: 'Field Notes', category: 'Editorial design', description: 'A pocket journal pairing field sketches with fold-out maps and notes from the trail.' },
  { title: 'Interval', category: 'Identity / Motion', description: 'An identity study for a listening room. Condensed type stretches and contracts to the pace of a record.' },
  { title: 'Kiln Club', category: 'Packaging', description: 'Clay stamps, paper wraps and a small maker’s mark for a collection of everyday ceramics.' },
  { title: 'First Light', category: 'Digital design', description: 'A morning programme presented as a simple timetable, with colour marking the shift from one session to the next.' },
].map((card, i) => ({ ...card, id: 'slot-' + (i + 1) }));
export const homeCards = [superbalist, bagmee, ...emptyCards.slice(0, 3)];
export const workCards = [bagmee, superbalist, ...emptyCards];
export const furtherCards = emptyCards.map(card => ({ title: card.title, tags: card.category }));
