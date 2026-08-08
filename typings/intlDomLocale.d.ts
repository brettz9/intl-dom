declare var intlDomLocale: string|undefined;
declare var setNavigatorLanguages: (languages: false|string[]) => void;

interface GlobalThis {
	jsonExtra: unknown;
	setNavigatorLanguages: (languages: false|string[]) => void;
	intlDomLocale?: string;
}
