// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  redirects: {
    '/about': '/#about',
    '/skills': '/#skills',
    '/education': '/#education',
    '/learning': '/#learning',
    '/work': '/#work',
    '/contact': '/#contact',
  },
});
