# Random Order V2 — work detail review

29 October 2026. Figma component corrections are complete for the two desktop reference frames. Content completion and the proposed UX changes remain separate work. Sneaker Lab is marked **Copy pending** in the layer list and is not ready for publication.

## Review links

- [EARNT — corrected frame](https://www.figma.com/design/vgYfEWkI3aTN7MXX9GVftJ/?node-id=1088-1758)
- [Sneaker Lab — corrected frame, copy pending](https://www.figma.com/design/vgYfEWkI3aTN7MXX9GVftJ/?node-id=1088-1519)
- [Shared patterns — V2 / Templates](https://www.figma.com/design/vgYfEWkI3aTN7MXX9GVftJ/?node-id=1112-468)
- [Visual comparison](/Users/hotel/.codex/.chatgpt-projects/g-p-6a8fe3a29a4881919ac449a7b1fb108b/random-order/docs/work-detail/comparison.png), [EARNT after](/Users/hotel/.codex/.chatgpt-projects/g-p-6a8fe3a29a4881919ac449a7b1fb108b/random-order/docs/work-detail/earnt-after.png), [Sneaker Lab after](/Users/hotel/.codex/.chatgpt-projects/g-p-6a8fe3a29a4881919ac449a7b1fb108b/random-order/docs/work-detail/sneakerlab-after.png)

## 1. Audit and corrections made

Both pages contained largely standalone site UI. Existing navigation, footer and media masters were available in V2 / Templates; no work-detail header, copy block, formula, gallery-row or project-navigation master existed. Historical detachment cannot be established from the present node types, so these are recorded as standalone or duplicated elements rather than assumed detached instances.

| Area | Change made | Preserved |
|---|---|---|
| Project headers | Two instances of one new header master; editable title, lead, category and four metadata pairs | Existing values, positions and metadata hierarchy |
| Narrative blocks | Fifteen instances of one new label/copy master: eight EARNT, seven Sneaker Lab | Authored block heights and section order |
| Formula rows | Two instances with four editable content slots | Original term artwork, operators and captions; no formula added to either page |
| Gallery rows | One flexible slot-based master used for EARNT’s three-column row and Sneaker Lab’s paired photographs | Three 434×760 items with 20px gaps; two 624×698 items with 96px gap |
| Media containers | Five existing Editorial Media Slot instances: three EARNT, two Sneaker Lab | Captured image paints, dimensions and crop placement |
| Project navigation | Two instances with editable text, replacing outlined UI lettering | Current V2 neighbour names and two-column composition |
| Site navigation | Kept the existing V2 Difference navigation; removed EARNT’s extra legacy navigation | Current top navigation |
| Footer | Replaced both manual footers with the canonical V2 desktop footer | Full-width placement and the existing 700px outer footprint |
| Layout | Changed the root/body height behaviour to fit content | 1920px canvas, 12-column grid, 288px margins, 32px gutters and authored section spacing |

The footer now uses the existing V2 master’s composition. This is a visible system correction, not a reconstruction of the old manual footer. Shared site text uses the existing Bebas Neue/Hanken Grotesk styles and theme/type variables. The lead follows the shared 22/32 style; section labels follow the shared 12px style. Project artwork retains its own fonts and colours. No new token collection or competing component library was created.

EARNT is now 13,564px high; removing the obsolete 81px navigation accounts for its height change. Sneaker Lab is 10,828px high, removing approximately 4,193px of unused fixed body height before the footer. The section contents and sequence remain in place. The original EARNT video layer was retained intact.

## 2. Content verification

### EARNT

The published project name is **EARNT**. Its formula is **Revolution + Street Culture + Nature = EARNT**. The published case continues through website work, merchandise, apparel concepts and River Cafe deliverables. It supplies source credits and AI labels that must accompany the corresponding assets if brought into V2. [Published EARNT](https://therandomorder.com/work/earnt)

The V2 narrative is recognisably related, but it is a distinct draft. It includes additional campaign imagery and different metadata choices. It still contains three old poster placeholders, an empty merchandise area and a closing placeholder. Those were preserved as draft content, not treated as verified deliverables. Its typography specimen and some internal labels also come from earlier templates. V2’s previous-project title is Hally’s; the published previous destination is Sussex. That difference needs a deliberate V2 curation decision.

Recommended content pass: map the approved V2 sequence to real website/deliverable assets; replace the stale placeholders; reconcile section titles and credits; then verify the final story with Jason. Do not automatically overwrite V2 with the live site’s arrangement.

### Sneaker Lab

The current frame is titled **BSTN × SNEAKERLAB** and includes basketball-court imagery, paired photographs and care-kit/sleeve artwork. Its header, narrative, formula placeholders, Cozy Heaven logo and typography specimen still contain copied bedding-project content. The user confirmed that final copy does not yet exist. These values were retained during component substitution and are **draft placeholders**, not approved Sneaker Lab facts.

The saved Hotel Atelier handoff was located at:

`/Users/hotel/.codex/.chatgpt-projects/g-p-6a65dce7bc44819188c993c2d5539bcb/Hotel Atelier/Random Order/Random Order — Continuation Handoff.md`, lines 332–365.

It describes a historical **2023 Sneaker LAB rebrand proposal**, including a system sequence, identity exploration and product taxonomy. It contains no BSTN reference, final case-study prose or verified outcomes. Treat this as contextual material for a potentially separate story. [Original proposal linked by the handoff](https://www.figma.com/design/2V93HDhBVNELxRIefZwPVs/Sneaker-LAB-%7C-Rebrand--Proposal--V2-?node-id=701-105)

The two subjects should not be merged by assumption. In particular, the existing four-cell placeholder row is not evidence of the original proposal’s formula. See [Sneaker Lab source and copy brief](/Users/hotel/.codex/.chatgpt-projects/g-p-6a8fe3a29a4881919ac449a7b1fb108b/random-order/docs/work-detail/SNEAKER-LAB-CONTENT.md).

## 3. Shared architecture and remaining gaps

Use one page foundation—site navigation, project header, ordered content blocks, project navigation and footer. Let the project’s content determine its blocks. A whole-page component with every possible section would impose too much structure.

| Family | Recommended sequence | Reference and constraint |
|---|---|---|
| Narrative / process | Intro → challenge/context → approach/formula → creative outcomes → outcome/credits | EARNT. Formula is optional elsewhere. |
| Visual / gallery | Short intro → strong opening image → authored media groups → brief supporting context → credits | Current BSTN × SNEAKERLAB artwork. Remove the copied bedding story when real copy is approved. |
| Extended case study | Context → problem → principles/system → development → applications → evidenced results | A future option when actual material supports it; the historical Sneaker LAB proposal could support process, not unverified results. |

Implemented masters: Project Header, Copy Block, Formula / Four Terms, Gallery Row and Project Navigation. The formula and gallery use editable content slots so project artwork can differ. Row spacing and item proportions remain composition choices. These are desktop patterns, not finished responsive templates.

| Requirement | Status / next action |
|---|---|
| Intro and metadata | Covered by the new Project Header |
| Narrative / approach | Covered by Copy Block; optional Formula |
| Image and media | Reuse existing Hero, Featured, Archive and Editorial Media Slots; do not replace working video/artwork groups merely to wrap them |
| Gallery arrangements | New Gallery Row supports authored groups; propose full-width, asymmetric and dense arrangements through the same media contract |
| Captions / credits | Existing small text style is available. Propose a small caption/credit pattern when wiring actual source and AI credits; a media-slot placeholder label is not a publication caption. |
| Related work | Existing work-card masters can be reused. Add at most two meaningful recommendations when curation warrants them; no separate card design is needed. |
| Responsive behaviour | Still to design and validate: header metadata 4→2→1 columns, copy label above body, formula wrapping/stacking and gallery stacking in reading order |

## 4. Published Work UX

The current index has three featured rows and eight archive links. Whole cards are real links with useful visible project names. This already supports selective curation and does not demonstrate a need for search, filters or infinite scrolling. [Current Work index](https://therandomorder.com/work)

A live desktop check confirmed the index-to-EARNT journey and the hover cursor label. At 390px, featured imagery and copy stack legibly. Opening the mobile menu and pressing Escape left it open; its button continued to announce “Open menu” while expanded. Source review also found incomplete closed-menu focus handling and an apparent mismatch in clean-route active-link matching. These are limited observations, not a complete accessibility audit. [Current navigation script](https://therandomorder.com/js/main.js?v=95)

Proposals, in priority order:

1. Repair mobile-menu dismissal, focus behaviour and active-route indication. Give keyboard focus equivalent feedback and keep essential labels visible on touch.
2. Add a clear Back to Work link and a named next-project preview on detail pages. Keep the link useful without hover.
3. Preserve index position/focus on return, using stable project anchors where needed.
4. Keep three carefully chosen featured projects with a quiet archive. Add Sneaker Lab only after its story and place in the selection are settled.
5. Consider image enlargement for technical or detailed artwork. Avoid mandatory carousels or extra gestures to reach the core story.

## 5. Gallery exploration and recommendation

Recommend **authored CSS Grid compositions** as the starting point. Model rows and items explicitly; keep document order equal to reading order. Browser visual reordering does not change keyboard or screen-reader order. [CSS Grid accessibility guidance](https://drafts.csswg.org/css-grid-1/#order-accessibility)

| Option | Useful for | Decision |
|---|---|---|
| Authored Grid | Full-width image/video, paired or asymmetric rows, deliberate whitespace and sequence | Preferred foundation for both reference pages |
| Masonry | Dense exploratory collections with many independent images | Optional archive experiment; weaker for a narrated case study. The library’s horizontal-order option only mostly preserves horizontal order. [Masonry options](https://masonry.desandro.com/options.html#horizontalorder) |
| React Photo Album | Automatically arranged photography collections | Worth a contained prototype if a dense archive is approved. Rows/columns/masonry are available; mixed media needs custom rendering and server rendering needs deliberate configuration. [Official documentation](https://react-photo-album.com/documentation) |

The exact **Meticulous Grid** reference could not be identified from primary sources. Do not select or install a dependency on that name alone; obtain the intended URL. The phrase “a meticulous grid” on an editorial case study is descriptive, not proof of a component product.

Useful visual references:

- [Studio Ahremark — Crop Magazine](https://www.studioahremark.com/case/crop-magazine/): large statements, generous whitespace and alternation between broad and paired imagery. Borrow pacing rather than its overlay-header treatment.
- [PORTO ROCHA — W Hotels](https://www.portorocha.com/whotels): motion opening, concise context and a substantial mixed-media sequence. Random Order can use the sequencing principles with a smaller navigation footprint.

Required gallery contract: image/video type, intrinsic dimensions, alt text, caption/credit, contain/cover rule, focal point, width/span, row grouping, optional full-bleed treatment and authored order. Preserve source proportions for diagrams and packaging layouts; use cover only when the crop is intentional. On mobile, stack in the same order, keep captions adjacent, and allow pairs only where both remain readable. Dense layouts should be a chosen project mode, not an automatic reshuffle of every case study.

Interaction should start with scrolling and ordinary links. Optional enlargement should retain the selected image, support keyboard navigation, Escape and a visible Close control, contain focus, and return focus to the opener. Respect reduced motion. [WAI modal-dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)

## 6. React / Next.js considerations

The local implementation currently uses Astro, TypeScript and CSS; React and Next.js are not installed. A React gallery can be evaluated as an isolated island in Astro without migrating the website. Check integration compatibility with the installed Astro version before adding packages. [Astro v5 React integration](https://v5.docs.astro.build/en/guides/integrations-guide/react/), [islands](https://v5.docs.astro.build/en/concepts/islands/)

If Next.js is selected later, `next/image` should receive intrinsic dimensions or a correctly sized fill container, actual responsive `sizes`, and narrowly scoped remote-image patterns. These choices affect layout stability and downloads. [Next.js Image reference](https://nextjs.org/docs/app/api-reference/components/image)

Decide the framework after CMS editing, preview, routing, hosting and image delivery needs are known. Start with static project content and a small ordered block model. Use client code for behaviour that needs it. Reserve image dimensions, load below-fold media progressively, use poster images for video, and provide playback controls for meaningful motion content. Do not make a library or framework decision from gallery appearance alone.

## 7. Practical implementation plan and decisions

| Step | Concrete output | Status |
|---|---|---|
| Component reconciliation | Five masters and corrected instances on both existing desktop frames | Done |
| Content pass | Approved EARNT asset/credit map; Sneaker Lab subject, draft copy, project status and credits | Pending content work |
| Responsive design | One small and one intermediate reference width per family, including long titles and mixed media | Proposed |
| Gallery prototype | Full-width, paired, asymmetric and dense examples; video and optional enlargement | Proposed; use existing Astro first |
| Work navigation | Accessible menu, return-to-index, named next project and optional curated related work | Proposed |
| Architecture choice | Record whether static Astro remains sufficient or CMS/preview requirements justify Next.js | Deferred until requirements exist |

No website pages, production navigation, dependencies or framework were changed during this review. No new public content was published. The proposed rearrangement of Sneaker Lab, related-work selection, responsive variants and richer gallery behaviour require a design/content decision before implementation.

## 8. Verification and limits

Final checks covered component master links, shared text styles, media retention, gallery item order/geometry and before/after renders. Captured pre-audit image/video hashes are retained. No shared-pattern text clipping was found. Two text objects remain outside a pre-existing cropped Sneaker Lab artwork frame; the artwork was preserved rather than reframed without source direction.

Evidence: `audit-before.json`, `component-changes.json`, `verification.json` and the before/after PNGs in this folder. The earlier media inventory was shallower than the final one, so their total hash counts are not directly comparable. The final screenshots verify static desktop composition; motion playback and complete responsive behaviour remain unverified. Content-rich, publication-ready reference pages still depend on the content pass described above.
