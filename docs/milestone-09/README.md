# Milestone 09 — production Work pages

Five project pages now use the current selected production artwork within the existing Astro website. Cozy Heaven and Adidas gain detail routes; Superbalist, Sneaker LAB × BSTN and Gold’s Gym are updated to their specified current frames. All five are discoverable from Work and have related-project navigation. The homepage design, existing card content, navigation, typography foundation and route conventions are preserved.

| Project | Route | Presentation | Integrated content |
| --- | --- | --- | --- |
| Cozy Heaven | `/work/cozy-heaven/` | Case Study | Care narrative from original brand deck, campaign compositions, textile/fibre studies, 18 source swatches, forest interiors and film posters |
| Superbalist | `/work/superbalist/` | Case Study | Identity, iconography, mobile compositions, order/delivery specifications, blueprints, full icon library and Stitch visual language |
| Adidas | `/work/adidas/` | Visual Story | Adidas × I ART JOBURG portrait, tissue, open box and two packaging-board crops; concise descriptive copy and explicit unverified project details |
| Sneaker LAB × BSTN | `/work/sneaker-lab/` | Visual Story | Thinking Unity pitch narrative, basketball imagery, court geometry, monochrome/orange graphics and black/white packaging mockups |
| Gold’s Gym | `/work/golds-gym/` | Visual Story | Current golden-light fitness poster and press portrait, visual direction and concise process-direction drafts |

The existing Sneaker route is retained under the brief’s allowance for application conventions. Work now shows 10 selected projects, including the existing external Sussex destination. Nine local detail routes are built. There are 19 built HTML pages overall: 14 website routes, 4 lab routes and 404.

## Shared implementation

Reused `ProjectPage`, `ProjectHeader`, `EditorialBlocks`, `MediaFigure`, `ProjectNavigation`, `WorkCard`, `ProjectCardText`, `Base`, navigation/footer, tokens and coordinated video playback. No framework, dependency or competing page model was introduced.

The existing model now accepts explicit case-study/visual-story modes, source hero height/content offset/title/opacity treatment, authored block spacing, and gallery column proportions/gaps/width. The existing renderer controls arbitrary text, media, galleries, headings, formulas, quotes and credits. The new palette block uses semantic HTML/CSS for Cozy’s source swatches. Tablet/mobile reflow keeps metadata readable and stacks paired artwork in source order.

At the user’s follow-up request, **all image enlargement buttons, image-viewer dialogs and their navigation/zoom controls are removed** from production and lab galleries. The unused shared viewer/script and lab viewer logic/styles were removed. Project links, collection filters and film/motion playback controls continue to work. Artwork has no overlay buttons obscuring it.

## Media and content

36 new media records and 102 local responsive WebP files are integrated. All requested static selections were retrieved. Original source files remain on disk in ignored curation folders; runtime assets have no temporary Figma URLs. Captions and source references distinguish historical Superbalist artefacts from contemporary reconstructions. Original brand typography remains embedded in the supplied artwork.

The specified source frames were audited before implementation; see `AUDIT.md` and individual project audit reports for slot IDs, geometry, retained copy and exclusions. Figma was not edited. Inherited Superbalist material was removed from Cozy/Adidas; repeated Superbalist paragraphs were consolidated. Empty colour/media slots, stray anchors and Gold’s unrelated romantic image were excluded without generating replacement imagery.

## Missing or unverified material before publication

- **Cozy Heaven:**3 original embedded film files unavailable. Exact posters are integrated. Final editorial release, product claims and project credits remain to be confirmed.
- **Gold’s Gym:**1 original embedded fitness film unavailable. Exact poster is integrated. Process-direction paragraphs are brief-derived drafts; no original structured prompt transcript or detailed methodology was supplied.
- **Adidas:** commission/concept status, date, scope, credits and image provenance are not verified. The page explicitly says project details are pending verification; no six-year, UX or Stitch claims remain.
- **Superbalist:** individual archive version dates and full contributor credits are not supplied. No invented outcomes or metrics are included.
- **Sneaker LAB:** remains Pitch / Concept, with no commercial-release claim. Final editorial release remains pending.

The five records remain `ready` and `noindex` for review. Nothing has been deployed or publicly released. Missing media is also recorded in `missing-media.json`.

## Validation

- Cozy was built and checked first, then the four remaining records were integrated through the validated renderer.
- Browser: 20 project/viewport observations at 1920, 853, 390 and 320 CSS pixels; every route 200, no horizontal overflow, no broken images, source image order/crops inspected. Desktop source hero height 1080 and opening spaces 200/200/200/96/160 match the selected frames. Sneaker pairs are 624/624 with 96px gap and 600/610 with 85.863px gap.
- Browser: all five Work links present, Product/Digital filter shows Superbalist, All restores 10 projects; mobile menu opens/closes with Escape and returns focus; reduced-motion heading stays visible with zero reveal animations.
- Browser: image-control removal verified across 14 website/lab routes; no page errors. Final screenshots contain no image-control overlays.
- Homepage canonical card fields are compared with the previous milestone; card composition/media/copy remain unchanged apart from Cozy’s new destination. Existing lab collection filtering is checked after viewer removal.
- `npm test`: 20 tests passed. `npm run test:site`: 3 tests passed, including internal routes/fragments and all built asset references.
- `npm run check`: 55 files, zero errors/warnings, one existing deprecated `matchMedia.addListener` compatibility hint.
- `npm run build`: 19 pages, successful. `git diff --check`: clean.

Sneaker and Gold desktop title positions were finally checked at 388px and 406.5px from the page top, matching the detached source headers.

Evidence: `header-browser-results.json`, `browser-results.json`, `cozy-browser-results.json`, `regression-browser-results.json`, project manifests/audits and local desktop/mobile PNGs. Current final screenshot filenames end in `-complete.png`; earlier Cozy screenshots document the first stage before the image controls were removed.
