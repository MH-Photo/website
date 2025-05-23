import mdx from '@astrojs/mdx';
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://mh-photography.com',
	i18n: {
		locales: ['de', 'en', 'es', 'fr'],
		defaultLocale: 'en',
		routing: {
			prefixDefaultLocale: false,
		},
	},
	integrations: [
		mdx({}),
		sitemap({
			i18n: {
				locales: {
					de: 'de',
					en: 'en', // The `defaultLocale` value must present in `locales` keys
					es: 'es',
					fr: 'fr',
				},
				defaultLocale: 'en',
			},
			filter: (url) => {
				return !url.startsWith('https://mh-photography.com/en/');
			},
		}),
	],
});
