# Browser validation — Milestone 08

Verified in the primary task on 29 October 2026 using the supported browser controls and the local preview. The final pass used an isolated tab through `localhost:4321`, allowing the shared preview and the user's other windows to remain available.

## Actual checks

| Area | Observed result |
| --- | --- |
| Production routes | All 12 routes opened at observed CSS widths 853 px and 390 px; no horizontal overflow or broken visible image was found |
| Desktop | Case studies, Work, Logos, About, Contact and editorial lab checked at 1920 × 1080; homepage also checked at 1600 × 1111 and the restored normal viewport |
| Narrow screens | Home, Work, Superbalist, Logos, About and Contact checked at 320 px; no horizontal overflow |
| Work filtering | Product / Digital showed Superbalist only; All restored eight projects; labels and pressed state updated |
| Production gallery | Opening, right-arrow navigation, zoom, original-image link, Escape and focus return verified; final dialog placement centered and background scroll locked |
| Mobile menu | Open/close labels, expanded state and Escape recovery verified; focus returned to the menu control |
| Contact | Empty submission focused Name and kept the draft hidden; valid artificial values produced an encoded studio mail draft and focused its review link; no mail app was opened and no message was sent |
| Homepage hover equivalent | Keyboard focus reached the Hally’s image link; the card matched focus-within, its transition was 0.45 s and the resulting image filter was grayscale(0) |
| Client marks | 12 original logos per group; two equal 2,331 px groups in the observed normal viewport; Pause/Play state worked |
| Home video | Hero reached readyState 4, muted and playing; the other two films retained unloaded sources. Explicit Pause stopped playback |
| Project video | EARNT initially had manual policy, paused state and no src. Play loaded the film and produced one playing video; moving it offscreen paused it |
| Flash | Manual Next/Reset worked; a 700 ms one-pass review reached 07/07, announced Review complete and disabled Stop |
| Typography | All three controls entered their playing state; the complete accessible headings remained Random Order, Stories to tell and Hally’s |
| Gallery experiments | All three routes opened. Archive filtering produced five assets; its dialog advanced 1/5 to 2/5 with the keyboard and returned focus on Escape |
| Media | Desktop source sequences were scrolled through and inspected; reported broken-image lists were empty. The Sneaker artwork also showed completed requests and correct source sizes/crops |
| Editorial spacing | Computed opening padding matched the source choices: Gold 0, Sneaker/EARNT 96, Superbalist 200 px |

The repeatable route observations are saved in `responsive-browser-results.json` and `desktop-browser-results.json`. The primary browser pass also exercised later fixes to gallery centering, narrow layouts, shared card links and per-project opening space.

## Automated support

- 10 media-controller tests cover reduced-motion poster/manual Play, manual mode, single ownership, visibility priority, persistent user pause, background/offscreen pausing, native/lab play capture, errors, autoplay refusal and missing-IntersectionObserver fallback.
- Four Flash-controller tests cover manual start, all three intervals, 100-source-frame runtime bounds, blockers, timing changes, cleanup and manual stepping.
- Five content tests cover identities, real files, intrinsic dimensions, responsive variants, editorial references and related projects.
- Three built-output tests cover routes, canonical URLs, anchors and rendered asset paths.

Reduced-motion and background lifecycle behaviour were checked through these behavioural tests and the CSS fallbacks. The actual browser pass used viewport simulation; it was not a physical-device test or a claim of a formal accessibility certification.

## Verification boundaries

Initial child-agent browser attempts had no enabled browser surface and a native-app timeout. The first primary shared-window attempt was interrupted by window activity. Those attempts are not counted as passes; the successful isolated primary pass above supersedes that limitation.

Full-page browser captures can include delayed lazy-image painting or extra capture margins. The live image requests, intrinsic dimensions and gallery detail were checked separately; the Gold full-page capture shows the full five-image sequence. Figma screenshot and mutation ledgers are documented in the two refinement reports.
