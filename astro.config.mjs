import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://brendanmayer.github.io/',
  integrations: [tailwind(), mdx()],
  markdown: {
    shikiConfig: {
      theme: 'nord'
    }
  }
});
