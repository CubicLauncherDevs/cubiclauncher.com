import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { localeDocDirs, localeSlugMap } from '$lib/docs/structure';

export const load: PageLoad = async ({ params }) => {
	const slug = params.slug;

	try {
		const modules = import.meta.glob('../../../lib/docs/**/*.md', { eager: true }) as Record<string, any>;
		const localeContent: Record<string, any> = {};

		for (const locale of Object.keys(localeDocDirs)) {
			const dir = localeDocDirs[locale];
			const fileMap = localeSlugMap[locale] || localeSlugMap['es'];
			const relativePath = fileMap[slug];

			if (!relativePath) continue;

			const fullPath = Object.keys(modules).find(p =>
				p.includes(`/${dir}/`) && p.endsWith(`/${relativePath}.md`)
			);

			if (fullPath) {
				localeContent[locale] = modules[fullPath];
			}
		}

		if (Object.keys(localeContent).length === 0) {
			throw error(404, `No se pudo encontrar la página: ${slug}`);
		}

		const meta = localeContent[Object.keys(localeContent)[0]].metadata || {};

		return { localeContent, meta };
	} catch (e) {
		if ((e as any).status === 404) throw e;
		throw error(404, `No se pudo encontrar la página: ${slug}`);
	}
};
