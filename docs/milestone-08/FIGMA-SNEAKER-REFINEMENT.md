# Sneaker LAB × BSTN — pitch refinement

Updated on 29 October 2026 in the existing Random Order V2 file.

- Page: `1014:1457` — V2 / Build Experiment Test
- Frame: [RO / Work / Sneaker LAB × BSTN / Desktop / Pitch](https://www.figma.com/design/vgYfEWkI3aTN7MXX9GVftJ/?node-id=1088-1519)
- Frame ID: `1088:1519`
- Final bounds: 1920 × 6622 px; 900 px hero, 5022 px body, 700 px footer at Y 5922.

## Content and composition

The header, metadata and three short editorial sections now use the canonical `sneaker-lab` project record, grounded in the original Workbench BSTN × Sneaker LAB care-kit sleeve pitch. The title, brief, Thinking Unity explanation and visual-direction text identify the work as a pitch/concept rather than a delivered commission or measured outcome. No date, client outcome or invented testimonial was added.

The original basketball-court composition (`1088:1545`), paired reference images (`1116:1256`), collaboration marks (`1088:1598`), identity studies (`1126:5142`) and football hero artwork (`1088:1521`) remain. The existing header, copy, gallery, navigation and footer masters remain connected. The next-project link now points to Superbalist in the curated project sequence. Body spacing remains 96 px with 96 px top and 120 px bottom padding.

Removed inherited material: Cozy Heaven’s outlined logo, unrelated four-term rationale, EARNT/Sussex image row, bedding typography study, four bedding copy sections, and the unfilled closing placeholder. All removal IDs and descendant IDs are recorded in `figma-sneaker-refinement-ledger.json`.

## Guards and validation

- Source copy and removal-node names/parents were refreshed before mutation; exact copied-text guards protected any intervening user edits.
- Zero text matches for Cozy, bedding, Lyocell or DACH remain in the frame.
- The three edited copy blocks reflow to 66 px each using shared text styles and auto-layout.
- The frame remains editable: 152 descendants including 48 text nodes, 16 instances, 32 vectors and the existing content slot.
- Changed interface/editorial text uses Bebas Neue and Hanken Grotesk. Preserved project artwork also uses Lexend and DIN Condensed. DIN Condensed cannot be loaded through the current Figma API; it was left unchanged, and only the fonts of edited product text were loaded.
- Full high-fidelity `get_design_context` obtained after content refinement. It emits invalid, extremely large crop percentages for the existing court-background image; the native artwork render remains correct. Use the exported discrete artwork asset when translating that crop into the website.
- One bounds correction explicitly persisted the compact auto-layout dimensions so screenshot/export metadata also reports 6622 px rather than the previous 11135 px.
- Final full-view screenshot: `sneaker-refined-figma.png`, 1920 × 6622.
- Only inherited footer badge motion remains: 16-second linear rotation. No project-specific animation was added.
- Gold’s Gym `1166:131` and Superbalist `1130:735` were not modified.

No website code was changed in this refinement.
