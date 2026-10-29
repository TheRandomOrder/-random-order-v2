# Random Order V2 — homepage handoff

Implemented in a workspace copy of the existing application:
`/Users/hotel/.codex/.chatgpt-projects/g-p-6a8fe3a29a4881919ac449a7b1fb108b/random-order`

Original application:
`/Users/hotel/Documents/Codex/2026-09-17/files-pasted-by-the-user-build/outputs/random-order`

The original folder, Figma source and synced `sources/` PDFs were not modified. No additional pages or dependencies were introduced. Existing unused components remain available.

## Design and discovery

Primary: [active desktop homepage, 1017:678](https://www.figma.com/design/vgYfEWkI3aTN7MXX9GVftJ/RANDOM-ORDER-X-HA?node-id=1017-678).

Reviewed V2 Foundations (`989:13` canonical baseline), V2 Build, V2 Templates mobile homepage (`960:311`), and V1 Playground metadata. The mobile reference predates the current desktop composition; desktop controls current project selection and full-width dark sections, while mobile controls type endpoints, line breaks, card stacking, navigation and footer reflow.

The [published homepage](https://therandomorder.com/) was inspected for existing navigation, project destinations, contact and brand assets. V2 typography and page structure take precedence.

The existing application uses Astro 5, TypeScript, plain CSS tokens, Tailwind's existing Vite integration, and an installed but unused GSAP dependency. It had only a hero and three placeholder project cards. Existing Base, Container, Eyebrow, Header, MobileMenu and Footer components were reused or adapted. No React migration, new animation library, or framework was needed.

## Implemented

- White navigation with actual `mix-blend-mode: difference`, hover/focus/active states and 44px primary targets.
- Mobile disclosure with Escape, focus trapping and return, background inert state and scroll lock.
- Cinematic hero using the exact EARNT film embedded in Figma, grayscale treatment, editable copy and intentional mobile line breaks.
- Four reusable project cards in current desktop order: Hally’s, Cozy Heaven, EARNT, Sussex.
- Reusable media component with responsive WebP posters, lazy images, viewport-triggered video loading, muted inline playback, pause/play, offscreen/background pausing and reduced-motion fallback.
- Full-width dark Trusted By strip and process section, services, testimonial, contact invitation and responsive footer.
- Local Bebas Neue, Hanken Grotesk 400/700 and Instrument Serif Italic, including OFL licenses.
- Fluid 56–132px hero, 48–88px section headings and 32–44px titles. A 1344px maximum container gives 288px margins at 1920; mobile uses 20px margins and stacked cards.
- Editable content in `src/data/home.ts`; visual tokens in `src/styles/tokens.css`.

## Main files

| File | Responsibility |
| --- | --- |
| `src/pages/index.astro` | Homepage section order and composition |
| `src/layouts/Base.astro` | Document metadata, shared structure and script loading |
| `src/data/home.ts` | Project content, services, process and navigation |
| `src/components/Header.astro`, `MobileMenu.astro` | Responsive navigation |
| `src/components/Hero.astro` | Paired typography and cinematic media |
| `src/components/FeaturedProject.astro` | Reusable project row / stacked mobile card |
| `src/components/MediaContainer.astro` | Poster, video and playback controls |
| `src/components/TrustedBy.astro` | Approved marks strip |
| `src/components/EditorialSection.astro` | Reused section rhythm |
| `src/components/Footer.astro` | Desktop and mobile footer |
| `src/styles/global.css`, `tokens.css` | Appearance, layout, fonts and responsive values |
| `src/scripts/navigation.ts`, `media.ts` | Accessible interactions and media behavior |
| `scripts/media.test.mjs` | Media policy regression tests |

## Asset provenance

The user directed asset discovery to Desktop → Working. SHA-1 hashes of the local films exactly match Figma's VIDEO fill hashes:

| Local public asset | Figma source | SHA-1 |
| --- | --- | --- |
| `assets/earnt.mp4` | Hero `1056:2050` and project `1056:1916` | `ce6d253cb6f24d5558eb7895cf262bfd764f4cbd` |
| `assets/hallys.mp4` | `I1056:1908;960:389;960:261` | `72579903e32bfe5ddd0b8f3dca375c300732c579` |

Both originals are under `/Users/hotel/Desktop/Working/Mid-journey Sort/`. Poster PNGs were exported directly from the corresponding media layers without modifying Figma. Cozy Heaven, Sussex, the approved client-strip screenshot, arrow and monogram were downloaded from the design context. The existing circular footer badge came from the published website. Production raster files are optimized WebP versions; downloaded PNG originals are retained under `docs/source-assets/`.

No replacement imagery was generated. No temporary Figma URLs are used at runtime.

## Validation

- `npm run check`: 23 files, **0 errors, 0 warnings, 0 hints**.
- `npm test`: **4 tests passed**. Covers reduced-motion no-fetch/no-autoplay behavior, viewport and background pausing, persistent manual pause, explicit play, preference changes and media errors.
- `npm run build`: **passed**, one static homepage generated.
- No lint command existed in the original project.
- Browser tested at **1920×1096, 1440×1000, 768×1024, 390×844 and 375×812**.
- At each width, the document width matched the viewport; no heading or summary had unexpected horizontal text overflow. Mobile content widths were 350px and 335px. Desktop content at 1920 was 1344px, x=288.
- The 1920 hero editorial container was measured at x=288, y=255, matching Figma. All local images loaded. Browser warning/error logs were empty in the final desktop review.
- Browser-tested hero pause, Work/About anchor navigation, mobile open/close, Shift+Tab focus trap, Escape, focus return, inert removal, scroll unlocking and active destination state.
- Reduced-motion behavior was verified with controlled media-controller tests and CSS review; a real operating-system preference toggle was not exercised.
- Reviewed full-page desktop and mobile screenshots against the Figma composition. Fixed focus-induced scrolling inside the clipped hero and resized mobile client marks into a readable horizontally scrollable strip.

Screenshots: `home-1920.jpg`, `home-1440.jpg`, `home-768.jpg`, `home-390.jpg`, `home-375.jpg`; viewport captures `hero-1920.jpg`, `hero-390.jpg`, `hero-375.jpg`. Full-page browser captures can place fixed navigation at the scroll position used for capture. Use the viewport captures and live page for navigation review.

This is not a pixel-perfect certification. Video frame timing differs between captures, and mobile intentionally reconciles the older template with the newer desktop design. No Lighthouse score or Safari/device certification is claimed.

## Decisions required before publication

1. **Cozy Heaven metadata:** the active Figma card uses EARNT’s description and repeats project number 03. These were preserved in `home.ts` rather than replaced with invented copy. Confirm its description, numbering and destination.
2. **Testimonial:** Figma says “I've never experienced a creative partnership like it.” The live source says “I've never experienced a partnership like it.” The V2 wording is retained for design review and requires approval.
3. **Navigation:** confirm Marks versus Logos and the Magazine destination. Current V2 primary labels remain; Marks links to the published `/logos` page. Magazine is disabled text because no destination exists within the authorized homepage scope.
4. **Social destinations:** the published homepage uses `#` for Instagram and LinkedIn. These are presented as text until actual profile URLs are supplied.
5. **Client marks:** desktop uses the exact approved raster strip and crop. Mobile keeps marks readable through horizontal scrolling. For a future independently responsive logo grid, supply individual approved vector marks.
6. **Mobile selection:** the older mobile template has three projects; this implementation retains the current desktop set of four and reflows them coherently. Confirm this selection during creative review.

The next milestone is a focused content and art-direction review to resolve these items, followed by Safari/real-device review and deployment through the existing hosting workflow. Additional pages remain outside this implementation.
