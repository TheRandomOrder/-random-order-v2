import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({ site: 'https://therandomorder.com', output: 'static', devToolbar: { enabled: false }, trailingSlash: 'never', vite: { plugins: [tailwindcss()] } });
