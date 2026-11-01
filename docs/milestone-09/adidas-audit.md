# Adidas — Milestone 09 source audit

Source: [V2 frame 1183:940](https://www.figma.com/design/vgYfEWkI3aTN7MXX9GVftJ/RANDOM-ORDER-X-HA?node-id=1183-940), inspected 1 November 2026. Frame size: 1920 × 7639. No Figma nodes were changed.

## Content decision

The title **ADIDAS** and selected artwork belong to this presentation. The header category, introduction, project name, scope, period, focus, narrative paragraphs and section headings are inherited from Superbalist. They must not enter the Adidas page.

Excluded material includes the six-year claim, 2017–2023 period, Product Design / UX / Stitch scope, the S-symbol narrative, historical-interface claims and generative reconstruction narrative. Existing generic Gold’s Gym media-layer names and AI-image-study captions are also inherited; they are not evidence of Adidas provenance.

The supplied record uses a short factual description of visible material: apparel, printed tissue and kraft packaging featuring Adidas and **I ART JOBURG**. It makes no claim about a commission, commercial release, role, year, outcome or production status. The artwork board itself contains labels such as “limited edition” and “production ready”; those labels are preserved inside the original artwork, but are not promoted into verified project facts.

The website metadata includes **Project details: Pending verification**. The record remains `ready`, which the existing renderer marks `noindex`.

Before publication, verify the commission/concept status, original brief, project date, author’s scope, collaborators and credits, image provenance, photography or generative-image status, and whether any depicted packaging was manufactured or released. No project-specific motion or video is supplied.

## Artwork and source slots

Four distinct artwork originals were downloaded using the Figma-provided `curl -L` sources and visually inspected. Three shared website SVGs were downloaded for source completeness; the existing footer and navigation components should continue to supply the matching website artwork. No interface screenshot is used as a website asset.

| Website media ID | Figma slot | Original / treatment |
| --- | --- | --- |
| `adidas-header` | `1183:1122` | Portrait `69cd3.png`, hash `268a074c6ab5bc40c72a41458581f86dffe22d38`; image-only authored crop, about x0/y263/w1009/h567 source pixels. Source layer is luminosity at 7% opacity over black. Use `headerOpacity: 0.07` and grayscale treatment. |
| `adidas-portrait` | `I1183:952;1116:469;1183:978;960:267` | Same 1024 × 1536 portrait. Opening slot 1344 × 896, crop transform y0.1710372/h0.4444444. `aspectRatio:1344/896`, cover, vertical position30.787% preserves this crop. |
| `adidas-tissue` | `I1183:964;960:267` | `67a8c.png`, 1536 × 1024, hash `5d200e4ab13c2a93b40cfe1e480c493bd300a521`. Repeating Adidas trefoil and I ART JOBURG tissue; centred fill at 1344 × 756. |
| `adidas-open-box` | `1183:967` | `11251.png`, 1536 × 1024, hash `5521d34b627353bb2a0901c9976069ec7d487b43`. Open kraft box, tissue and seal; centred fill at 1344 × 1042. |
| `adidas-packaging-concept` | `1265:13873` | `f07e8.png`, 1536 × 1024, hash `0be7163c57fafe42518700d7a48abab21966b04b`. Upper board crop: 1344 × 396, transform y0.078125/h0.4419643; cover with vertical position14%. |
| `adidas-packaging-details` | `1265:13877` | Same board, lower crop: 1344 × 396, transform y0.5395405/h0.4419643; cover with vertical position96.6856%. |

The source order is portrait → tissue → open box → upper packaging board → lower packaging board. These five image slots remain in that order. Full originals remain available through the existing enlargement viewer for the four body sources; crop records share original artwork files. The header has a separate image-only crop because its source transformation includes a horizontal crop as well as a vertical crop. Rounding to source pixels changes the source crop by less than half a pixel.

The source hero is 1080 px tall, title132 px, and opening editorial padding200 px. Existing content width1344 px, section spacing96 px, type and shared navigation/footer should be reused. Removing unrelated paragraphs deliberately shortens the source sequence; no blank narrative modules should remain. The factual intro and short “Selected studies” paragraph are descriptive working copy, not a verified project narrative.

## Media output and motion

Production assets are in `public/assets/projects/adidas/m09/`: five WebP sources and ten 480/960 px responsive variants, 1,673,212 bytes in total. The four original files retain their native dimensions. The separate header crop is1009 × 567. Quality90 is used for the sources,86 for responsive variants. No replacement imagery was generated.

`adidas-media.json` contains six canonical media records; `adidas-project.json` contains the proposed shared-system record. These files are integration inputs, not a second runtime content model. `adidas-asset-manifest.json` records exact dimensions and byte sizes. `adidas-downloads.json` records download completion without temporary asset URLs. Raw originals and the reference screenshot are under `adidas-source-assets/` and follow the existing ignored-source convention.

Recursive motion context reports only inherited footer node `I1183:974;973:129`:16 s, linear, infinite rotation. Reuse the existing footer motion and reduced-motion fallback. There is no Adidas-specific timeline to invent or video to substitute.

## Validation scope

All seven downloaded source files and the reference screenshot are non-empty. All15 optimised files have readable raster metadata and expected responsive dimensions. All six media records resolve to existing local assets and retain useful alternative text. Root integration should validate the effective crops, header opacity, source order, enlargement, related links and responsive stacking in the browser. No browser or server was operated for this bounded audit.
