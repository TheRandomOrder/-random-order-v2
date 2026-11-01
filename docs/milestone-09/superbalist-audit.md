# Superbalist — Milestone 09 source audit

Source: [V2 / Build Experiment Test, frame 1130:735](https://www.figma.com/design/vgYfEWkI3aTN7MXX9GVftJ/?node-id=1130-735). Read 1 November 2026. No Figma nodes were changed.

The current frame expands the earlier website record into a product and design-system case study. The shared Astro project renderer remains the implementation. The current source has a plain black 1920 × 1080 introduction, a 1344px editorial column, 200px opening space and 96px main gaps. Its title is 132px at the desktop reference size. This replaces the website's older photographic header while retaining its route, index thumbnail, metadata, narrative and canonical project ID.

## Artwork inventory and sequence

The `superbalist-asset-manifest.json` records intrinsic dimensions, responsive variants, source IDs and output sizes. Each selected crop is exported from the discrete artwork/media node, not from the project webpage. This preserves the nested clipping and the brand typography within original source artefacts.

| Order | Source node | Artwork | Source slot / ratio | Treatment |
|---|---|---|---|---|
| 1 | 1291:14902 | Fashion portrait in blue, orange and pink | 1344 × 1080 | Exact selected crop; contemporary AI-assisted study |
| 2 | 1130:769 | Three-phone reconstruction | 1344 × 908 | Exact media sequence including the authored white surround |
| 3 | 1130:783 | Navigation identity vocabulary | 1344 × 756 | Exact artwork crop; contemporary system study |
| 4 | 1126:5173 | Field of S studies | 1344 × 756 | Exact selected construction/crop |
| 5 | 1142:5652 | Wordmark blueprint | 1344 × 1042 | Current source geometry and opacity retained in export |
| 6 | 1262:13278 | Upper phone detail | 1344 × 756 | Authored close crop, contemporary reconstruction |
| 7 | 1262:13281 | Lower phone detail | 1344 × 756 | Matching authored close crop |
| 8 | 1262:13284 | Order and delivery specification | 1344 × 810 | Native source board, including responsive notes, cards and tracking states |
| 9 | 1262:13436 | Icon construction detail | 1344 × 515 | Exact source crop; default export is 2688 × 1030 |
| 10 | 1262:13437 | Full icon-library source | 2560 × 1440 original raster | Supplemental source already embedded in Figma; includes delivery, collection, shipping and click-and-collect rows hidden by the selected detail crop |
| 11 | 1262:13438 | Three mobile compositions | 1344 × 756 | Exact supplied archive composition |
| 12 | 1262:13442 | Stitch visual-language principles | 1344 × 756 | Native source board; default export is 2688 × 1512 |

The full icon library is a deliberate addition from the same selected source, following the mandate's explicit delivery and collection requirement. The existing cropped detail is retained. No replacement imagery was generated, no artwork was redrawn and no unrelated project images were added.

All 12 primary files are local WebP with the same dimensions as their supplied export/source. Smaller variants are 480px and 960px, with 1600px variants for the three larger source boards. Primary files total 2,604,212 bytes. Fine source boards retain their native 2560px/2688px versions for enlargement.

## Editorial handling

The source's introductory statement, four metadata pairs and four distinct prose sections are retained verbatim. The repeated “Revisiting the work” instances are consolidated into the single approved paragraph. A caption-only empty group (1153:5790) is not rendered. Old reusable layer names containing “Gold’s Gym”, “Rope” and “Strength” are inherited container names; their actual fills are Superbalist artwork and are classified by content rather than those stale names.

The “Identity meets interface” heading, system paragraph and S study retain their nested grouping through a 12px authored `spaceBefore` override. Main editorial spacing stays at the shared 96px value.

One short factual introduction to the archive boards has been composed from the supplied artefacts: it names order tracking, delivery states, icon construction, mobile composition and Stitch principles. It makes no claims about launch metrics or commercial outcomes.

Contemporary photographic imagery, reconstructed phone mockups and reinterpretations are captioned as contemporary studies. The specification, icon-library and visual-language source boards are captioned as Stitch archive/source artefacts. The 2017–2023 period is supplied in the source metadata; individual artefact versions are not assigned invented dates. The wordmark retains the existing “Captured in 2026” distinction.

## Missing or unverified material

- No assets selected in the current frame failed retrieval.
- No video is supplied in the selected frame. Its only Figma motion is the shared footer badge's existing 16-second linear rotation.
- Individual archive artefact version dates and full contributor credits are not supplied. The order specification includes an example 4 April 2023 delivery date, which is part of the artwork, not a claimed design release date.
- No additional standalone illustration commission is identified by the frame. The supplied icon and visual-system artwork is integrated; unrelated artwork has not been substituted.
- No performance metrics or commercial outcome evidence is supplied, so none is claimed.

## Integration handoff

- `superbalist-project.json`: one updated canonical-compatible record. Uses `mode: case-study`, `headerHeight: 1080`, `headerTitleScale: large`, `headerStyle: plain`, and the existing `extended` presentation value.
- `superbalist-media.json`: 12 new media records with source IDs and local variants.
- `public/assets/projects/superbalist/m09/`: 39 responsive image files. Existing legacy media stays available for the preserved Work-index thumbnail and historical records.
- Root integrates these fragments into the existing canonical JSON after Cozy Heaven validates. Parent owns route/browser validation and shared type/CSS integration.
