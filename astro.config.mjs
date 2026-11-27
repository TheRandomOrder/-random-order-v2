import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://therandomorder.com',
  output: 'static',
  devToolbar: { enabled: false },
  trailingSlash: 'always',
  vite: { plugins: [tailwindcss()] },
  integrations: [{
    name: 'editorial-template-previews',
    hooks: {
      'astro:config:setup': ({ command, injectRoute }) => {
        if (command !== 'dev' && process.env.VERCEL_ENV !== 'preview') return;
        injectRoute({ pattern: '/dev/templates/', entrypoint: './src/templates/Index.astro' });
        injectRoute({ pattern: '/dev/templates/home/', entrypoint: './src/templates/Home.astro' });
        injectRoute({ pattern: '/dev/templates/work/', entrypoint: './src/templates/Work.astro' });
        injectRoute({ pattern: '/dev/templates/superbalist/', entrypoint: './src/templates/Superbalist.astro' });
      },
    },
  }],
});
