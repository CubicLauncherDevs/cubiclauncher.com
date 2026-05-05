declare module '*.md' {
	import type { ComponentType, SvelteComponent } from 'svelte';
	const component: ComponentType<SvelteComponent>;
	export default component;
	export const metadata: Record<string, any>;
}
