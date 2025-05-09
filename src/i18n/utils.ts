import { defaultLang, routes, showDefaultLang, ui } from './ui';

export function getLangFromUrl(url: URL): string {
	const [, lang] = url.pathname.split('/');
	if (lang in ui) {
		return lang as keyof typeof ui;
	}
	return defaultLang;
}

export function getLangPath(): (lang: string) => string {
	return function path(lang: string): string {
		return !showDefaultLang && lang === defaultLang ? '/' : `/${lang}/`;
	};
}

export function useTranslations(lang: keyof typeof ui): (key: keyof (typeof ui)[typeof defaultLang]) => string {
	return function t(key: keyof (typeof ui)[typeof defaultLang]) {
		return ui[lang][key] || ui[defaultLang][key];
	};
}

export function useTranslatedPath(lang: keyof typeof ui): (path: string, l?: string) => string {
	return function translatePath(path: string, l: string = lang) {
		const pathName = path.replaceAll('/', '');
		const hasTranslation = defaultLang !== l && routes[l] !== undefined && routes[l][pathName] !== undefined;
		let translatedPath = `${hasTranslation ? `/${routes[l][pathName]}` : path}/`;

		translatedPath = translatedPath.replace(/(#\w+)\/$/gm, '$1');

		return !showDefaultLang && l === defaultLang ? translatedPath : `/${l}${translatedPath}`;
	};
}

export function getRouteFromUrl(url: URL): string | undefined {
	const pathname = new URL(url).pathname;
	const parts = pathname?.split('/');
	const path = parts.pop() || parts.pop(); // NOSONAR

	if (path === undefined) {
		return undefined;
	}

	const currentLang = getLangFromUrl(url);

	if (defaultLang === currentLang) {
		const route = Object.values(routes)[0];
		return route[path] !== undefined ? route[path] : undefined;
	}

	const getKeyByValue = (obj: Record<string, string>, value: string): string | undefined => {
		return Object.keys(obj).find((key) => {
			return obj[key] === value;
		});
	};

	const reversedKey = getKeyByValue(routes[currentLang], path);

	if (reversedKey !== undefined) {
		return reversedKey;
	}

	return undefined;
}

export function getRouteFromStaticPath(url: URL, path: string): string | undefined {
	if (path === undefined) {
		return undefined;
	}

	const currentLang = getLangFromUrl(url);

	if (defaultLang !== currentLang) {
		path = path.replace(`${currentLang}/`, '');
	}

	const getKeyByValue = (obj: Record<string, string>, value: string): string | undefined => {
		return Object.keys(obj).find((key) => {
			return obj[key] === value;
		});
	};

	const reversedKey = getKeyByValue(routes[currentLang], path);

	if (reversedKey !== undefined) {
		return reversedKey;
	}

	return undefined;
}
