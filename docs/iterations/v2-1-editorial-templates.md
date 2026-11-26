# V2.1 editorial template study

## Review

The template index is at `/dev/templates/`. The Superbalist study is at `/dev/templates/superbalist/`. Both are Astro static pages. Local development registers them automatically. Vercel preview builds register them when `VERCEL_ENV=preview`. The production and default static builds omit both routes. Both preview pages carry a robots noindex directive.

The work started from the clean `codex/work-magazine-iteration` checkout at `90346ae`. Development uses `dev/v2-1-editorial-templates` in a separate worktree. The public project record and public Superbalist scene have no edits.

## Composition

The neutral Figma frame 2871:11212 determines the sequence. It opens with a dark project header and a full-bleed field, moves through three equal panels and a pair of shallow bands, then uses an asymmetric pair, two deeper bands, a centred statement, four text columns and a project rail. A second full-bleed field precedes the closing stack. Text grows to its natural height. The empty tail of the 14,536px Figma frame is omitted.

The ordered fixture in `src/templates/editorial/superbalist.ts` owns all sample prose and module order. To change the composition, reorder entries or change their properties. The names on navigation cards link to existing project pages. Their inclusion in this study carries no editorial endorsement.

| Reused | Application |
| --- | --- |
| Base, Header, MobileMenu, Container, Eyebrow | Page shell, navigation, skip link, desktop container and metadata |
| ProjectHeader | Accepts just the header fields from ProjectRecord. Its optional back link can be omitted. Existing callers retain the public default. |
| ProjectCardText | Archive variant supplies card title and metadata |
| Existing font files, colour tokens, gutter, display and card scale, focus and reduced-motion styles | Shared foundations |

The new modules are TextBlock, TextGrid, SplitText, MediaBlock, MediaGrid, MediaStack, EditorialHeading, Statement, PullQuote and ProjectNavigation. The preview navigation composes a horizontally scrollable archive rail and a return link. The public navigation component depends on neighbours in the production project registry. The preview modules avoid importing production records into the synthetic fixture.

## Rhythm and type decisions

| Element | Desktop reference | Responsive decision |
| --- | --- | --- |
| Content | 1,344px on a 1,920px canvas | Existing max-width and gutter, 288px margins at reference |
| Module, text, statement | 48px gaps, 24px internal gaps, 48px text padding, 96px statement padding | Fluid lower bounds, statement padding twice the module gap |
| Header and section display | 108px and 88px | Local Big Shoulders, as in the studies. Existing display-size token drives the section role. |
| Editorial heading and statement | 60–64px and 68px | Bebas Neue. A 64px desktop heading role unifies the two heading samples. Line heights are 1.09 and 1.05. |
| Project cards | 44px | Existing card scale, with semantic h3 inside the navigation section |
| Large, editorial, standard body | 22px, 18px, 16px | Hanken Grotesk. Editorial body has a 930px maximum measure and 1.45 line height. Large opening and column copy uses 1.3. |
| Eyebrow and media labels | 12px and 88px | Shared Hanken eyebrow. Geist Mono for the centred desktop height annotation. |

MediaBlock takes a reference height and width, then uses their ratio. The supported height scale is 160, 254, 412, 688 and 1080. The 514px height is a measured exception. The neutral fixture uses only the weights that occur in its media fields. MediaGrid divides the available row width after subtracting gaps. At phone widths its panels stack at 4:3, while full-width fields retain their own ratios. TextGrid accepts one to four columns, caps the tablet layout at two and uses one on phones.

## Figma discrepancies for design review

| Observation | Implementation |
| --- | --- |
| Frame 2871:11275 is 1,336 × 514. | Retain the 514px height at reference size. Align the stack to the normal 1,344px content measure. |
| Frame 2871:11268 uses 851px and 437px columns inside 1,336px, with a 48px gap. | Preserve the 4px inset and measured column ratio. |
| Full-bleed frame 2871:11594 measures 1,920 × 1,080 but its annotation reads 688. | Use 1,080 for the ratio and label. |
| The neutral frames use #B4B4B6. | Use the provisional #B5C0CF from the mandate throughout. |
| Figma uses fixed text boxes and experiments with copy from different projects. | Synthetic copy determines text height. SplitText and PullQuote exercise two short narrative slots. |

The comparison sources were the [V2.1 section](https://www.figma.com/design/vgYfEWkI3aTN7MXX9GVftJ/BRAND-OS-x-RANDOM-ORDER?node-id=2900-13317), Rhythm Test A (2837:9412), neutral study (2871:11212), Modular Lego Patterns (2771:3788), canonical library (1001:489) and [Brand OS](https://docs.google.com/document/d/1xQZ2g1rmxhONLyplOzwFzHRwsxa5vZ1mg1a5wImvDZ0/edit).

## Validation

Astro check reported zero errors, zero warnings and 12 hints in existing files. All 31 unit tests passed. All six site-output tests passed in each build mode. Production generated 39 pages and preview generated 41. The new output test checks the route set, sitemap, incoming links from public pages, robots metadata and one h1 per study page.

For local review, use `npm run dev`. To reproduce the preview output checks, use `VERCEL_ENV=preview npm run build` followed by `VERCEL_ENV=preview npm run test:site`. A default `npm run build` followed by `npm run test:site` exercises the production exclusion.

The [hosted Chromium run](https://github.com/TheRandomOrder/-random-order-v2/actions/runs/45888972476/job/140146633168) passed at 1,920px, 768px and 390px. The study showed four, two and one text columns respectively, with no horizontal page overflow. At 1,920px the hero measured 1,080px tall, the equal row started at x=288 and each panel measured 416 × 412. The unequal row measured 851px and 437px. Automated WCAG A/AA checks returned no violations at the three widths. Mobile keyboard checks covered skip-to-main, menu focus, Escape, return focus and index navigation. Reduced-motion mode produced immediate scrolling. These checks cover Chromium only.

The hosted Vercel review URL is pending. The branch is published, but the existing Vercel project has no Git integration and the CLI could not resolve its API from this session. The isolated local worktree is linked to the existing Vercel project. From that worktree, `npx vercel deploy --target=preview` requests a preview deployment. Append `/dev/templates/` to the deployment URL for review.
