# Legacy portfolio migration — 12 November 2026

Local implementation branch: migration/legacy-portfolio-2026-11-12. Preservation checkpoint e1ce577 remains intact. Existing homepage edits were carried forward, not overwritten. No push or deployment.

## Migration matrix

| Legacy URL | Project | Images | V2 record | Template | Status | Blockers |
|---|---|---:|---|---|---|---|
| https://therandomorder.com/work/hallys | Hally's | 29 | hallys | gallery | Existing V2: preserve and reconcile separately | Existing custom composition: source narrative and media reconciliation still required |
| https://therandomorder.com/work/sussex | Sussex | 13 | sussex | narrative | Migration draft | Desktop/mobile visual review and release approval required |
| https://therandomorder.com/work/earnt | Earnt | 15 | earnt | narrative | Existing V2: preserve and reconcile separately | Existing custom composition: source narrative and media reconciliation still required |
| https://therandomorder.com/work/tfb | The Fat Badger | 22 | tfb | narrative | Migration draft | Desktop/mobile visual review and release approval required |
| https://therandomorder.com/work/wright | Wright Architects | 7 | wright | narrative | Migration draft | Desktop/mobile visual review and release approval required |
| https://therandomorder.com/work/ham | Hām | 11 | ham | narrative | Migration draft | Desktop/mobile visual review and release approval required |
| https://therandomorder.com/work/scottusa | Scott USA | 5 | scottusa | narrative | Migration draft | Desktop/mobile visual review and release approval required |
| https://therandomorder.com/work/gadventures | G Adventures | 28 | gadventures | narrative | Migration draft | Desktop/mobile visual review and release approval required |
| https://therandomorder.com/work/adidas | Adidas × I Art Joburg | 6 | adidas | gallery | Existing V2: preserve and reconcile separately | Existing custom composition: source narrative and media reconciliation still required |
| https://therandomorder.com/work/brandmarks | Selected Brandmarks | 11 | brandmarks | gallery | Migration draft | Desktop/mobile visual review and release approval required |
| https://therandomorder.com/work/random-projects | Random Projects . | 1 | random-projects | gallery | Migration draft | Desktop/mobile visual review and release approval required |

## Evidence and boundaries

Captured public HTML, exact text sequence, source asset URLs, metadata and original related links are retained in source/ and inventory.json. Original assets are retained under originals/. 98 optimized image records and responsive derivatives were imported. Eight local routes were added/enabled; seven new records plus Sussex's existing record. Existing Hally’s, EARNT and Adidas custom compositions were preserved; reconciliation is pending rather than overwriting their approved work. The Logos wall remains intact; the additional Brandmarks route preserves its separate editorial narrative.

Source GitHub repository access has not been verified; public pages and local saved source supplied the evidence. Public availability is not a new release approval. Migrated records remain ready/noindex. Existing client metadata and quotes are retained without changing historical authorship. The importer maps gallery order to shared V2 layouts; it does not claim pixel parity or recreate all legacy animations. Animated GIFs currently use static first-frame previews; originals remain available for an accessible motion implementation. Inline interactive/SVG-only artwork needs comparison with source before release.

## URL preservation

All 11 live Work destinations have corresponding slash-terminated V2 routes. Eight migrated paths keep the original slug. Existing Hally’s, EARNT and Adidas paths remain unchanged. No hosting changes were made. At cutover, verify host handling of extensionless /work/slug URLs and explicitly map any historical .html aliases to /work/slug/ with permanent redirects. Existing links and generated assets pass the built-site checks; external source links and form delivery are outside those tests.

## Validation

Astro check: no errors, 10 existing hints. Existing content/media tests and built-site tests passed; 31 static pages built. Full desktop/mobile visual, keyboard and reduced-motion review remains outstanding. Do not treat these drafts as production-ready.

Browser review: all eight migrated routes rendered with expected titles and image counts. Actual available viewports measured 354px and 1309px despite requested 390/1440 overrides; no horizontal text overflow was detected. Exact six-width certification, full image-load/visual comparison and keyboard/reduced-motion review remain pending.
