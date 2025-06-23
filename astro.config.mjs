import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://mh-photography.com',
	integrations: [
		sitemap({
			i18n: {
				defaultLocale: 'en', // All urls that don't contain `es` or `fr` after `https://stargazers.club/` will be treated as default locale, i.e. `en`
				locales: {
					de: 'de',
					en: 'en', // The `defaultLocale` value must present in `locales` keys
					es: 'es',
					fr: 'fr',
				},
			},
			filter: (url) => {
				return !url.startsWith('https://mh-photography.com/en/');
			},
		}),
	],
});
