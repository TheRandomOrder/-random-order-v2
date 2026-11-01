# Sneaker LAB × BSTN — Milestone 09 source audit

Authoritative frame: [1262:12026](https://www.figma.com/design/vgYfEWkI3aTN7MXX9GVftJ/?node-id=1262-12026), V2 / Build Experiment Test. Read-only inspection; no Figma mutations.

The current frame replaces the older football hero and poster-led sequence. Its title and metadata sit on a plain black 1080px header; editorial content starts after 96px. The project remains a packaging pitch, with no commercial release, commission date or outcome inferred.

## Sequence and asset geometry

| Order | Source node | Content | Desktop slot | Implementation |
|---|---|---|---|---|
| 1 | 1262:12033 | Monochrome outdoor basketball | 1344 × 760 | Original 1254px square source, centre-cover in source slot ratio |
| 2 | 1262:12035 | BSTN streetwear / orange court portrait | 1344 × 896 | Exact supplied image; source filename identifies contemporary generated study |
| 3a | 1262:12038 | Orange basketball-court geometry | 624 × 698 | Native media-only export preserves the source crop; generated reference code contains invalid enormous crop percentages |
| 3b | 1262:12039 | Monochrome court / sleeve graphics | 624 × 698 | Native media-only export preserves the bottom crop of original artwork |
| 4a | 1262:12042 | Orange packaging mockup | 600 × 375 | Exact supplied image |
| 4b | 1262:12043 | Circular collaboration artwork | 610 × 375 | Native media-only export preserves supplied BSTN / Sneaker LAB typography and overlay |
| 5 | 1262:12079 | Black care-kit sleeve mockup | 1344 × 896 | Exact supplied image |
| 6 | 1262:12080 | White care-kit sleeve mockup | 1344 × 896 | Exact supplied image |
| 7–10 | 1262:12081–12087 | Brief, Thinking Unity and visual direction | 330 / 60 / 954 copy columns | Exact current Figma copy |

The court/monochrome pair keeps the source 96px gap. The orange box / circular-artwork pair uses source column weights 600:610, an 85.863px gap, and a centred 1296px maximum width. Both pairs stack in source order on mobile. Original brand artwork is never retyped or redrawn.

The heading divider `6854e.svg` is the same supplied divider already integrated as `/assets/projects/superbalist-divider.svg`; it is reused. The one-pixel `Group 5` at 1262:12090 is a stray export artefact, with no meaningful editorial content, and is excluded.

## Reuse and content

- Same dynamic route and `ProjectPage`, `ProjectHeader`, `EditorialBlocks`, `MediaFigure`, gallery viewer and project navigation.
- Mode: `visual-story`; existing route `/work/sneaker-lab/` retained.
- The project intro and three body paragraphs are copied from the current authoritative frame. Stage stays **Pitch / Concept**; no release claims are added.
- Eight local WebP images with intrinsic dimensions and useful 480/960px responsive variants. Native exports contain only artwork/media, never an entire page or UI section.
- The source header contains no hero image. The Work thumbnail uses the first selected court image.
- Recursive motion data contains only the inherited 16-second linear footer badge spin, already handled by the shared footer.

## Outstanding publication checks

No selected static artwork is missing. Final editorial sign-off are still required before public release. No supplied project video appears in this frame. The existing `ready` status remains unchanged, so the route stays `noindex` until publication is explicitly approved.

Final header fidelity: source category Y343 and title Y388 are preserved through the shared desktop header offset. Per the user follow-up, image enlargement controls are removed; gallery compositions remain static artwork.
