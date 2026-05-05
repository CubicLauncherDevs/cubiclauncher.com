import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	try {
		const modules = import.meta.glob('../../lib/docs/introduction.md');
		const path = '../../lib/docs/introduction.md';
		
		if (!(path in modules)) {
			throw error(404, 'No se pudo encontrar la introducción');
		}

		const post: any = await modules[path]();

		return {
			content: post.default,
			meta: post.metadata
		};
	} catch (e) {
		if ((e as any).status === 404) throw e;
		throw error(404, 'Error al cargar la introducción');
	}
};
