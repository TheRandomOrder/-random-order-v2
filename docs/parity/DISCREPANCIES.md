# Figma-to-code parity: work in progress

Source: V2 / Content & Layout, reviewed 5 November 2026. The file contains eleven current case-study frames plus a second SSUPERLATIVE systems frame. Section dimensions, image/video hashes and crop transforms are in `figma-geometry.json`; `asset-map.json` maps the generated section call sites to local filenames and source nodes. The raw design context in `source/` is retained for inspection, not used as a runtime image.

## Current implementation and remaining differences

| Frame / route | Status and discrepancy |
| --- | --- |
| SSUPERLATIVE / Project Alice (`1351:2283`) | New route and source compositions. Two original video fills are unavailable; exact embedded fonts and mobile composition remain unverified. |
| Hotel Atelier (`1351:2159`) | New route and source compositions. The lenticular-installation video is unavailable; some custom fonts fall back. Desktop inspection found media slots and typography still need comparison. |
| Publicis Machine (`1277:14558`) | New route and source compositions. Two original videos are unavailable; page requires visual verification. |
| MUSO (`1429:2058`) | New route and source compositions. One original video is unavailable; page requires visual verification. |
| Gold's Gym (`1432:1992`) | Existing route retained; source has four video fills and differs from the existing composition. |
| Hally's (`1270:14172`) | Existing route retained; `public/assets/hallys.mp4` SHA-1 matches Figma video `72579903e32bfe5ddd0b8f3dca375c300732c579`. Current frame still needs reconciliation. |
| Cozy Heaven (`1206:1212`) | Existing route retained; current source contains five video fills and several unrelated inherited slots; reconciliation remains. |
| Superbalist (`1130:735`) | Existing route retained; current source sequence and geometry require visual reconciliation. |
| Adidas (`1183:940`) | Existing route retained; current source sequence and geometry require visual reconciliation. |
| BSTN × LAB (`1262:12026`) | Existing route retained; current source sequence and geometry require visual reconciliation. |
| EARNT (`1088:1758`) | Existing route retained; current video hash `8b4a9372d05cdbc819cce5fc35cde28cd4b531ee` differs from local `earnt.mp4`; source includes a four-part composition whose image fills have been retrieved. |
| SSUPERLATIVE systems (`1532:1835`) | Separate expression confirmed by user. Not implemented: Figma supplies a shader requiring a runtime and browser feature not yet integrated. |
| The Shed / Orchard on Long | Existing working routes retained; not among top-level frames on the supplied page. |

The selected assets were downloaded from Figma. Do not treat existence of these files or the generated layouts as proof of visual parity. The four new pages are review drafts and are marked noindex. Figma hero templates for unrelated projects contain Cozy Heaven bedding text and metadata; those inherited values were not copied into the new heroes. The underlying source files remain untouched.

## Verification

Desktop Hotel Atelier was inspected at 1920px: the 1336px opening slot and 1344px copy grid are positioned at 292px and 288px respectively. Full desktop and mobile page-by-page comparison remains outstanding, as does effective geometry and playback checking for every slot. Build and type checking pass; unit tests pass. The built-site test flags duplicate `grad` identifiers inside repeated embedded SVG data URLs on the SSUPERLATIVE page; investigate/fix the markup or test parser before release. No production deployment was performed.
