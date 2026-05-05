import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const slug = params.slug;
	
	try {
		// Use import.meta.glob for better type safety and to avoid dynamic import issues in some environments
		const modules = import.meta.glob('../../../lib/docs/*.md');
		const path = `../../../lib/docs/${slug}.md`;
		
		if (!(path in modules)) {
			throw error(404, `No se pudo encontrar la página: ${slug}`);
		}

		const post: any = await modules[path]();

		return {
			content: post.default,
			meta: post.metadata
		};
	} catch (e) {
		if ((e as any).status === 404) throw e;
		throw error(404, `No se pudo encontrar la página: ${slug}`);
	}
};
