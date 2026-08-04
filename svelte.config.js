import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extension: '.md'
		})
	],

	extensions: ['.svelte', '.md'],

	onwarn: (warning, handler) => {
		if (warning.code === 'state_referenced_locally') return;
		handler(warning);
	},

	compilerOptions: {
		warningFilter: (warning) => warning.code !== 'state_referenced_locally'
	},

	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
		prerender: {
			origin: 'https://cubiclauncher.com',
			entries: ['*'],
			handleHttpError: 'warn'
		}
	}
};

export default config;
