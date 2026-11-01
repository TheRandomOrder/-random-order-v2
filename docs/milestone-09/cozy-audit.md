# Cozy Heaven source and implementation audit

Primary frame: `1206:1212`, V2 / Build Experiment Test. `/work/cozy-heaven/` uses the existing project renderer in case-study mode. Homepage card copy, image and design are preserved; the card now links to its detail route.

## Selected artwork

| Source node | Local media ID | Native composition |
| --- | --- | --- |
| 1206:1218 | cozy-m09-hero | 1920 × 1080 film poster, source luminosity treatment |
| 1265:13981 | cozy-m09-soft-cozy-campaign | 1344 × 760 bedding image with original campaign typography |
| 1265: 14055 | cozy-m09-joy-campaign | 1344 × 796 campaign poster and Süße Träume lettering |
| 1265: 14138 | cozy-m09-textile | 628 × 630 exact fibre crop |
| 1265: 14139 | cozy-m09-fibre | 628 × 630 exact fibre crop |
| 1265: 14029 | cozy-m09-fabric-ritual | 1344 × 576 folding-fabric poster |
| 1265: 14052 | cozy-m09-forest-bedroom | 1344 × 1080 exact selected room composition |
| 1206:1226 | cozy-m09-day-begins | 1344 × 756 film poster and original campaign lettering |
| 1277: 14756 | Semantic palette block | All 18 source swatches, six columns, same source order |

Native exports are discrete campaign artwork, photographs and film posters, never a screenshot of a website section used as a page asset. The campaign export’s stray one-pixel anchor at Y1272 created an unintended 478px white extension; this is trimmed to its actual 796px image. The room campaign’s inherited caption is outside its 756px image and is rendered as accessible HTML instead. All supplied brand lettering stays inside original artwork. Source files remain in the ignored `source-assets/cozy/` folder; responsive WebP files live in `public/assets/projects/cozy-heaven/m09/`.

The 601px empty label-only product block, large empty cream panel, final empty gradient panel and inherited Superbalist headings/copy/metadata are excluded. These experimental slots are not presented as completed project work. The additional repeat of the same campaign film poster is consolidated into one visual.

## Copy foundation

The original Desktop/Working `Cozy Heaven | Building the Brandpdf.pdf`, Phase 2, pages 12–22 provides the care story, five photography categories, colour worlds and production framework. Pages13–14 were also rendered and visually checked. Concise copy is adapted from this material; no commercial results, dates, material certifications or measured outcomes are invented. The existing homepage introduction is retained verbatim.

This is a contemporary AI-assisted brand exploration. It is not represented as a historic photographic campaign or completed Phase2 rollout. Deck notes about future work are described as direction and aims.

## Missing media / publication tasks

- Video hash `28ed5c680c8911b1ba98238e181ee9c8da08bce3`: bedroom/morning film, used in hero and later campaign composition. Exact poster is available; original playable file not retrieved.
- Video hash `bdafa68be21bd521fa882af8d4bba8cf01f270bd`: sunglasses/crisps-in-bed film. Exact campaign poster is available; original playable file not retrieved.
- Video hash `1cdc7375d975b1c8e350d70f9b5da601fd1d3c46`: fabric-folding film. Exact poster is available; original playable file not retrieved.
- Desktop/Working was inspected for matching files. No unrelated footage was substituted.
- Final editorial sign-off, product claims and release/credit information remain publication tasks. Route stays `ready` / `noindex`.

## First-stage validation

Cozy was validated before integration of the remaining four records. Browser widths 1920, 853, 390 and 320 showed no horizontal overflow or broken images. At 1920 the hero is 1080px and every selected artwork surface matches the native dimensions above. Textile row uses 628:628 columns and 85.863px gap. The gallery opened, ArrowRight advanced to 2/7, Escape closed it and focus returned to its trigger. Astro check: zero errors/warnings, one pre-existing deprecated-listener hint.
