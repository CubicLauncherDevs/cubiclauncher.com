import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	try {
		const modules = import.meta.glob('../../lib/docs/**/introduction.md', { eager: true }) as Record<string, any>;
		const localeContent: Record<string, any> = {};

		for (const [path, mod] of Object.entries(modules)) {
			if (path.includes('/en-EN/')) localeContent['en'] = mod;
			else if (path.includes('/es-ES/')) localeContent['es'] = mod;
			else if (path.includes('/fr-FR/')) localeContent['fr'] = mod;
		}

		if (Object.keys(localeContent).length === 0) {
			throw error(404, 'No se pudo encontrar la introducción');
		}

		const meta = localeContent[Object.keys(localeContent)[0]].metadata || {};

		return { localeContent, meta };
	} catch (e) {
		if ((e as any).status === 404) throw e;
		throw error(404, 'Error al cargar la introducción');
	}
};
