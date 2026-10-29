# Milestone 08 — Random Order V2 full website

Implemented in the existing Astro application. The shared typography, tokens, navigation, footer and approved homepage composition remain the foundation. No framework or dependency was added.

Open the [website](http://127.0.0.1:4321/work/) or the separate [motion lab](http://127.0.0.1:4321/lab/).

## Routes and content

| Route | Presentation |
| --- | --- |
| `/` | Existing V2 homepage, canonical project data, colour hover/focus, working project-image links and client-logo loop |
| `/work/` | Curated featured projects and archive, with working category filters |
| `/work/earnt/` | Narrative, founder brief, creative formula, website, apparel and River Cafe artefacts |
| `/work/sneaker-lab/` | BSTN × Sneaker LAB pitch: basketball geometry, reference imagery and identity studies |
| `/work/superbalist/` | Product and systems case study, 2017–2023 context and explicitly labelled contemporary reconstructions |
| `/work/golds-gym/` | Five-image art-direction pilot, original branded composition, paired gallery and narrow closing portrait |
| `/work/hallys/` | Verified café rebrand narrative, rationale, illustrations and original project material |
| `/work/the-shed/` | Concise identity archive |
| `/work/orchard-on-long/` | Identity and apple-form studies |
| `/logos/` | 36 original published brandmarks, enlargement and verified parent-project links |
| `/about/` | Approved studio positioning, portrait, principles and shared capabilities |
| `/contact/` | Accessible enquiry form that prepares a reviewable email draft |

The build produces 17 pages: 12 website routes, four isolated lab routes and a custom 404 page. Sussex retains its verified published destination; its HTTP response and project title were checked. Cozy Heaven remains a homepage preview because a supported complete detail page was not available. Magazine and unsupplied social destinations remain plain text.

The Contact form validates required fields, prepares an encoded `mailto:` draft and focuses its review link. It does not report a simulated successful submission. No email was sent during QA.

Project records are currently `ready` review records and their detail routes carry `noindex`. The lab always carries `noindex`. Release status can be changed in the content records when the corresponding editorial material is approved for public release.

## Figma and Workbench

The [page inventory](ROUTE-CHECKLIST.md) was recorded before the addendum implementation. It distinguishes the active homepage, two Work-index alternatives, modular experiments, EARNT, Sneaker LAB and the current Superbalist frame. No standalone About, Contact or Logos frame was present on that page; those routes use approved published content and the existing system.

Workbench page `7148:245` in RANDOM-HOTEL now has six named collections. Twenty-two existing source roots were grouped, with their global transforms and dimensions checked before and after. Shared identity references remain in their original strip.

| Collection | Group |
| --- | --- |
| Gold’s Gym | `7738:678` |
| Orchard on Long | `7738:680` |
| Hally’s | `7738:682` |
| The Shed | `7738:684` |
| EARNT | `7738:686` |
| Sneaker LAB × BSTN | `7738:688` |

Editable content-system and motion guidance boards were added at `7739:678` and `7739:686`.

The independent [Gold’s Gym pilot](https://www.figma.com/design/vgYfEWkI3aTN7MXX9GVftJ/?node-id=1166-131) is on Content & Prototypes. It reuses existing header, copy, gallery, media, project-navigation and footer masters. The previous pilot frame `1130:735` had been repurposed by the user as Superbalist; those newer edits were preserved. See the [Gold restoration report](FIGMA-GOLD-RESTORE.md).

[Sneaker LAB’s frame](https://www.figma.com/design/vgYfEWkI3aTN7MXX9GVftJ/?node-id=1088-1519) now uses the actual pitch material. Inherited bedding copy, the unrelated Sussex/EARNT row and empty modules were removed. Its original artwork remains editable. See the [refinement report](FIGMA-SNEAKER-REFINEMENT.md) and both node ledgers.

## One content foundation

`src/data/content/projects.json` contains nine stable project records; `media.json` contains 99 media records. Seven projects have local detail routes. Homepage selection, Work discovery, related projects and the lab refer to these records rather than maintaining separate project copies.

The shared editorial renderer accepts text, headings, media, paired or variable galleries, creative formulae, quotes and credits in any sequence. Project-level category, header treatment, opening space and metadata allow different editorial structures. Opening space matches the captured source: Gold 0 px, Sneaker LAB and EARNT 96 px, Superbalist 200 px; mobile reflows use the existing smaller rhythm. The footer follows its natural shared website height rather than retaining empty canvas space.

Media records include intrinsic dimensions, responsive variants, fitting and focal position, captions, credits, source references and playback policy. Source artwork was exported as discrete artwork where needed; website interface text remains HTML. Native SVG assets and original credits were retained. Working originals and QA screenshots stay on disk outside the tracked production asset set.

Gold’s Gym is identified as AI-assisted concept imagery, without an invented commission, year or result. Sneaker LAB remains a pitch/concept with factual copy derived from its original brief; final marketing copy can be developed without changing the model. Superbalist’s contemporary interface reconstructions and 2026 reference material are distinguished from the historical work. Unsupported outcomes and credits were omitted.

## Motion and gallery decision

The production recommendation is the editorial gallery: it supports project-specific sequencing, paired images and narrow portraits while keeping mobile reading order intact. Use the archive treatment for larger collections such as marks. Reserve the cinematic treatment for short, focused image stories. All three remain available at `/lab/editorial/`, `/lab/archive/` and `/lab/cinematic/`.

The original Flash component contains 71 variants, mixed timeouts and a repeating sequence. Its creative source remains intact. The browser lab uses seven curated project images, explicit Play once/Stop/Reset/manual stepping, 450/700/1,000 ms intervals and a hard 30-second limit. Offscreen, hidden-document and reduced-motion blockers stop playback without automatically restarting it. Three typography studies remain user-triggered experiments.

Website motion includes 450 ms colour reveals, a seamless two-group client-logo loop with pause controls, selected heading reveals, keyboard image browsing and a shared video coordinator. Films load only when needed; manual project films wait for Play. Only one video plays at a time, offscreen/background playback pauses, and reduced motion retains static fallbacks.

## Validation and handoff

- 19 behavioural/content checks pass, including actual raster dimensions and responsive variants.
- Three built-output checks pass for routes, canonical paths, fragments and local resources.
- Astro builds 17 pages. Type checking reports zero errors and zero warnings; one compatibility deprecation hint concerns the intentional legacy media-query listener fallback.
- Actual browser checks cover desktop, tablet and mobile, plus a 320 px narrow-screen sweep. See [browser QA](MOTION-BROWSER-QA.md), [responsive results](responsive-browser-results.json) and [desktop results](desktop-browser-results.json).
- Gallery arrows, zoom, Escape and focus return, menu recovery, filters, enquiry validation, full Flash completion, typography triggers, logo pause and real video playback were exercised.
- Source Figma experiments, synced reference files and the original project stack remain available.

Run `npm test`, then `npm run build` and `npm run test:site` for the automated checks. The existing preview server is on port 4321. Local Git history records the foundation, full-route implementation and final validation stages; no remote was added.
