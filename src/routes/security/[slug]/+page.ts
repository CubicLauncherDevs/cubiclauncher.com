import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { SECURITY_ARTICLES, getSecurityArticle } from '$lib/data/security';

// No articles means no routes to prerender until the first one is published.
export const prerender = SECURITY_ARTICLES.length > 0;

export const entries = () => SECURITY_ARTICLES.map((article) => ({ slug: article.slug }));

export const load: PageLoad = ({ params }) => {
  const article = getSecurityArticle(params.slug);
  if (!article) {
    error(404, 'Security article not found');
  }

  return { slug: article.slug };
};
