import type { Module } from './model';

export const header = {
  title: 'Superbalist',
  category: 'Editorial template study',
  disciplines: [],
  intro: 'A synthetic passage set across two lines. The first line establishes a measure, and the second lets the eye settle before the page opens.',
  metadata: [
    { label: 'Study', value: 'Neutral rhythm' },
    { label: 'Material', value: 'Type and placeholder media' },
    { label: 'Version', value: 'V2.1' },
    { label: 'Copy', value: 'Synthetic editorial sample' },
  ],
};

export const modules: Module[] = [
  { kind: 'media', height: 688, bleed: true },
  { kind: 'heading', role: 'display', heading: 'The length of a line and the space around a sequence of images' },
  { kind: 'text', eyebrow: 'Opening passage', size: 'large', body: [
    'A long sheet rests on an empty table. One edge catches the light. Three smaller sheets sit beside it, each cut to the same dimensions. Read together they make a row. Read separately they leave the eye with three intervals and a choice about where to pause.',
  ] },
  { kind: 'mediaGrid', height: 412, weights: [1, 1, 1] },
  { kind: 'text', eyebrow: 'Paired fields', heading: 'A brief pause between two frames', body: [
    'Two wide rectangles occupy the same measure. The first carries the eye across the page. The second repeats that movement, leaving a narrow band of paper between them. A small change in spacing would make the pair read as a single shape.',
  ] },
  { kind: 'mediaStack', heights: [412, 412] },
  { kind: 'heading', eyebrow: 'Unequal widths', heading: 'One surface opens while the other holds its edge', narrow: true },
  { kind: 'text', body: [
    'Imagine folding a sheet almost in thirds. The crease sits a little off centre. When the paper opens again, one side has room for a long sentence. The other holds a few words and an expanse of quiet paper. The crease keeps both parts in relation.',
  ] },
  { kind: 'mediaGrid', height: 688, weights: [851, 437], inset: true },
  { kind: 'splitText', label: 'Margin note', copy: { body: [
    'A strip of paper slips out from beneath the larger sheet. Only its edge is visible at first. Follow it down the page and it becomes a second surface with a shape of its own.',
    'Leave a little air here. A short line can change the pace of the paragraph that came before it.',
  ] } },
  { kind: 'mediaStack', heights: [514, 688] },
  { kind: 'statement', eyebrow: 'A passage set at display size', text: 'Lay the sheets side by side. Let one edge run a little further than the rest. A narrow piece of paper can hold a single word. A broad sheet has room for a thought to turn around and find its way back to the beginning. Leave a space between them. The eye will cross it, take in the next shape, and return to the small detail that first caught the light.' },
  { kind: 'heading', role: 'display', heading: 'Four columns on a single sheet' },
  { kind: 'textGrid', columns: 4, eyebrow: 'Parallel passages', items: [
    { size: 'large', body: ['A single fold makes a line down the middle of a sheet.'] },
    { size: 'large', body: ['Fold it again. Four panels appear when the paper opens, each holding the memory of a different edge.'] },
    { size: 'large', body: ['The longest passage rests in the third panel. Its sentences gather against the fold, one after the other. There is enough room here to linger over the grain of the paper, the slight curl at its corner and the soft indentation left by a pencil. Then the paragraph ends.'] },
    { size: 'large', body: ['At the far edge, a final short passage leaves the rest of the column open.'] },
  ] },
  { kind: 'navigation', heading: 'Further work', cards: [
    { title: 'MUSO London', tags: 'Project page', href: '/work/muso/' },
    { title: 'SSUPERLATIVE', tags: 'Project page', href: '/work/ssuperlative/' },
    { title: 'Adidas', tags: 'Project page', href: '/work/adidas/' },
  ], back: { label: 'Return to template index', href: '/dev/templates/' } },
  { kind: 'media', height: 1080, bleed: true },
  { kind: 'heading', eyebrow: 'Closing sequence', heading: 'Three frames, with a line between them' },
  { kind: 'media', height: 688 },
  { kind: 'quote', text: 'Each time the sheet unfolds, a different edge becomes the beginning.', attribution: 'Synthetic text fragment' },
  { kind: 'mediaStack', heights: [688, 688], compact: true },
];
