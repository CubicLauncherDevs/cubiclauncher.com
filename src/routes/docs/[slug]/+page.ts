import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const slug = params.slug;
	
	try {
		// Use import.meta.glob with ** to search in subdirectories
		const modules = import.meta.glob('../../../lib/docs/**/*.md');
		
		// Find the module that matches the slug (e.g., .../Comenzando/install.md matches slug 'install')
		const path = Object.keys(modules).find(p => p.endsWith(`/${slug}.md`));
		
		if (!path) {
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
