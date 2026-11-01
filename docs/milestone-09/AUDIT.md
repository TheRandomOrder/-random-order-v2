# Milestone 09 — initial audit and implementation sequence

The build continues in Astro 5, TypeScript and existing CSS tokens. Dynamic `/work/[slug]/` routes use the canonical project/media collections, `ProjectPage`, `ProjectHeader`, `EditorialBlocks`, `MediaFigure`, `ProjectNavigation`, `Base`, gallery viewer and coordinated media playback. The homepage and Work index keep their established layout. No dependencies or parallel templates are added.

## Source inventory

All five requested frames on `V2 / Build Experiment Test` were inspected with full design context, a reference screenshot, source hierarchy/copy and recursive motion data before implementation. Figma is read-only for this milestone. The sole timeline animation is the existing shared footer badge: 16 seconds, linear, repeating; its reduced-motion fallback already exists.

| Sequence | Frame | Classification | Website action |
| --- | --- | --- | --- |
| 1 Cozy Heaven | 1206:1212 | Selected bedding artwork; refinement needed | Remove inherited Superbalist metadata and copy. Use original Cozy brand deck; preserve campaign artwork, textile studies, palette and room compositions. Register missing film originals. |
| 2 Superbalist | 1130:735 | Production case study; repeated placeholders | Preserve approved narrative and selected art; extend existing detail with historic specifications, iconography and Stitch material. Consolidate repeated copy and omit empty group. |
| 3 Adidas | 1183:940 | Selected project artwork; copy unverified | Preserve Adidas × I ART JOBURG portrait, tissue, packaging and diagrams. Exclude all inherited Superbalist prose and dates; clearly identify missing project details. |
| 4 Sneaker LAB × BSTN | 1262:12026 | Production pitch visual story | Use current court, packaging and product sequence with approved Thinking Unity narrative; preserve pitch status and exact brand artwork. |
| 5 Gold’s Gym | 1262:12370 | Selected fitness studies; partial/experimental | Use current fitness poster and press portrait. Exclude unrelated romantic image and six empty tiles; concise process drafts remain subject to editorial sign-off. |

## Shared implementation

- Both `case-study` and `visual-story` are explicit modes of the same project renderer, with ordered editorial blocks.
- Source-driven hero height/title treatment, gallery columns/gaps/width and block spacing are optional fields. Existing projects retain their defaults.
- A semantic palette block renders Cozy’s source colour study as native HTML/CSS.
- Existing responsive media variants, captions, focal points, enlargement, keyboard navigation and reduced-motion behaviour apply to new records.
- Existing `/work/sneaker-lab/` is retained under the mandate’s allowance for current route conventions. Cozy and Adidas gain local routes; all five appear in Work and have related-project navigation.

## Validation checklist

- [ ] Cozy first: source comparison, desktop/mobile, gallery and shared renderer.
- [ ] Integrate Superbalist, Adidas, Sneaker LAB and Gold’s Gym in sequence.
- [ ] All five routes and index links; no inherited cross-project placeholders.
- [ ] Desktop, tablet, mobile and 320px layouts; media loading and focal points.
- [ ] Keyboard gallery, Escape/focus return, menu and reduced-motion checks.
- [ ] Existing content/media/interaction tests, type check, build and built-output route/asset checks.
- [ ] Publication gaps and source provenance recorded in final handoff.
