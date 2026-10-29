# Random Order V2 homepage

This is a working copy of the existing September Random Order application, adapted to the active V2 Figma homepage. The original application and synced project references are untouched. The existing Astro, TypeScript, Tailwind/Vite dependencies and CSS architecture are retained; no dependencies were added.

## Local review

```sh
npm ci
ASTRO_TELEMETRY_DISABLED=1 npm run dev -- --host 127.0.0.1
```

Preview: http://127.0.0.1:4321/

```sh
ASTRO_TELEMETRY_DISABLED=1 npm run check
npm test
ASTRO_TELEMETRY_DISABLED=1 npm run build
```

Only `/` is built. Existing published project and Marks destinations are linked externally. Local Work, About and Contact navigation targets homepage sections. Contact opens the studio email address. Unconfirmed destinations remain text rather than broken links.

See [the implementation handoff](docs/HANDOFF.md) for design sources, verification, assets, and decisions needed before publication.
