# Random Order — V2 implementation mandate

**Working edition · 6 November 2026**  
**First reading path** — Work index → Publicis Machine → Superbalist or back to Work.

Build Random Order as an edited magazine. The index tells readers what the practice covers and lets them choose a story. Each feature makes an argument through its sequence of text, artwork and pauses. For Machine, a reader should be able to explain how a physical label experiment led to reversed lettering, then recognise that idea in the bottle and tennis studies. Use the same publishing structure for the next feature while letting its subject determine the composition.

## Read the right source

| Source | Use it for |
| --- | --- |
| [V2 / Content & Layout](https://www.figma.com/design/vgYfEWkI3aTN7MXX9GVftJ/RANDOM-ORDER-X-HA?node-id=1014-1457) | Locate current project frames and compare their revisions. The local editorial review and parity exports are dated evidence. Refresh the live frame before each pass. |
| [Work / Desktop / Work](https://www.figma.com/design/vgYfEWkI3aTN7MXX9GVftJ/RANDOM-ORDER-X-HA?node-id=1014-1458) | Production reference for the selected index. Its opening label, editorial introduction, tennis photograph and named list give a reader a complete entry point. |
| [Work / Desktop / Active](https://www.figma.com/design/vgYfEWkI3aTN7MXX9GVftJ/RANDOM-ORDER-X-HA?node-id=1034-2366) | Magazine direction and story formats. It contains editorial placeholders. Use the populated Work frame when these two frames disagree on publishable copy. |
| [Machine](https://www.figma.com/design/vgYfEWkI3aTN7MXX9GVftJ/RANDOM-ORDER-X-HA?node-id=1277-14558) | Hero, project voice, artwork, crops and sequence. The live desktop frame measures 1920 × 13284. The 8992px height in the November 4 review belongs to an earlier edit. |
| [SSUPERLATIVE](https://www.figma.com/design/vgYfEWkI3aTN7MXX9GVftJ/RANDOM-ORDER-X-HA?node-id=1351-2283) and [Design Systems](https://www.figma.com/design/vgYfEWkI3aTN7MXX9GVftJ/RANDOM-ORDER-X-HA?node-id=1532-1835) | Next editorial pass. Treat Project Alice as a chapter in the longer SSUPERLATIVE practice. Give the separate Design Systems expression its own destination when its content and runtime are ready. |

## Inspect before editing

Start in the website directory containing `astro.config.mjs`. Run `git status --short`. Inspect pending changes, including untracked scenes and parity assets, before touching a route. Follow a record from `src/data/content/projects.json` through `src/data/projects.ts`, `src/pages/work/[slug].astro` and `ProjectPage.astro` to the rendered page. Read the existing discrepancy log under `docs/parity/`. Keep the synced project references under `sources/` read-only.

Use the existing Astro static routes, TypeScript records, shared layout, local fonts, CSS tokens and media scripts. Preserve public slugs, inbound fragments, unpublished-page indexing policy and the existing homepage selections. Scope feature-specific art direction to its scene. Record any mismatch between current Figma and a cached export before using that export.

## Work index

1. Start with “01 / Selected index”, the authored introduction and the wide tennis-court photograph. At 1920px the cover occupies a 1344 × 650 slot. Link the cover to Machine. Keep a visible text entry for the same feature.
2. Preserve the curated sequence. Machine and SSUPERLATIVE open the list, followed by Gold’s Gym, MUSO London, Hotel Atelier, Design Systems, Hally’s, Cozy Heaven, Superbalist, Adidas, BSTN × Sneaker LAB and EARNT. The Design Systems row can be read as plain text until a real destination exists. Keep The Shed and Orchard on Long reachable under Further work and preserve the archive fragment.
3. Use short discipline lines and full-row links. On narrow screens the discipline follows the title. Keep the large display face for scanning and the small sans face for metadata.
4. Reconcile the lower featured and archive card collections separately. Several Figma cards reuse descriptions belonging to another project. Match each title, summary and artwork to its canonical project record before promoting that card. Use the existing WorkCard and MediaFigure components for approved sets.

## Machine as the first feature

| Beat | Implementation direction |
| --- | --- |
| Opening | Dark hero, Publicis Machine title and authored introduction. Follow with Client, Scope, Based and Concept. “Designed Backwards. Read Forwards.” names the premise. Keep the 1080px desktop hero flexible on phones. |
| Brief and experiment | Introduce the project, show the Publicis Machine wordmark, then the brief, stacked letterforms and court image. Explain that the labels were printed, cut and wrapped around a bottle. The reader needs this physical step before seeing the reversal. |
| Process and artwork | Preserve the Figma crop and orientation for each asset, including the horizontal reflection at node 1634:1368. The design intent is rear-facing reverse typography read through glass. Check the lettering against the approved artwork at full size. Keep live text separate from the photographic layers. |
| In context | Follow the wordmark, blurred court image and paired type studies with the shift into tennis, summer light and cocktails. Use the serif accent in “Machine in context.” Retain the distinction between the monochrome and botanical expressions. |
| Close | Identify the packaging concept as circa 2022. Distinguish the later visual explorations from the original concept. Keep the route back to Work and the authored link to Superbalist. Keep commercial production, sales and unconfirmed credits out of the copy. |

## Tokens, content and publishing

- **Grid and type.** Use `src/styles/tokens.css` and the existing 1344px container. At a 1920px viewport this leaves 288px on either side. Reuse Bebas Neue for display, Hanken Grotesk for labels and copy, and Instrument Serif italic for an editorial inflection. Machine uses a 108px desktop title, 22px/33px body and 12px tracked labels. Use the existing fluid scale, with roughly 18px/27px reading copy on phones.
- **Colour and rhythm.** Shared surfaces use white, near-black ink and thin neutral rules. The court pinks, bottle tones and motion blur come from the project imagery. Keep large visual pauses at chapter boundaries. Use the frame’s 96px desktop rhythm where it separates scenes, then reduce space for continuous mobile reading.
- **One record per project.** Store stable ID, slug, title, disciplines, introduction, metadata, sources, classification, publication status and related project IDs in the existing record. Index and navigation read from the same ordering. Use typed heading, text, media, gallery, quote and credits blocks for repeatable stories. A source composition selects a bespoke scene instead of the generic block renderer, so edits to its record’s fallback blocks alone do not change its body.
- **One identity per asset.** Keep media ID, local source, dimensions, alternative text, optional variants, crop and Figma node in the media registry. Reuse the same court asset for the feature and cover with separate crop rules. Inspect artwork at the rendered size. Preserve the supplied bitmaps and avoid substituting generated scenes for missing originals.
- **Edition workflow.** Refresh Figma context and screenshot → compare route and project record → reconcile copy and local media → render desktop → adapt the same reading order for tablet and phone → record discrepancies and publication status. Apply this to SSUPERLATIVE next, then the remaining named frames one at a time. WORK SLOTS is a production reference board. Keep it outside the public project list.

## Acceptance and handoff

Run from the site root:

```sh
npm run check
npm test
npm run build
npm run test:site
npm run preview
```

Inspect both changed routes at 390, 768 and 1920px. At each width follow the cover, a project row, Back to work and the related-project link. Tab through the page and mobile menu, verify visible focus and check 44px interactive targets. Enable reduced motion and confirm readable static content and manual media controls. Read the feature with images delayed. Check heading order, alt text, metadata wrapping, crop, orientation and chapter order. Compare desktop sections to the live frame side by side, including the lower card and gallery sections. Keep newly surfaced differences attached to a route and node.

**Implemented and checked in this pass.** The populated index opening, cover, ordered list and Further work links are in the existing Work route. Machine has current hero metadata, process copy, three new responsive images, type studies, chapter sequence and related navigation. Existing tests now distinguish embedded SVG markup inside quoted attributes from fragment IDs in the page. The production build emitted 23 pages. Astro reported zero errors and warnings, with ten hints. All 20 unit tests and three built-site checks passed. Chrome measurements at all three widths found every rendered image loaded and no horizontal page or paragraph/heading overflow. At 1920px the measured cover was 1344 × 650 and the Machine hero was 1080px high.

**Still open before visual sign-off.** Machine currently flows past unavailable source media instead of reserving empty screens. Reconcile the media at 1277:14564, 1588:3225 and 1586:2258, the featured-card typography and overlays at 1586:2255, and the remaining artboard annotations against approved originals. Final desktop image-by-image parity, keyboard and reduced-motion walkthroughs, and art-directed mobile approval remain open. The lower index collections need the project-level editorial check above. Other features retain their existing review status. Publish only after these decisions are recorded against the relevant route.
