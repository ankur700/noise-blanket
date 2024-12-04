/** @type {import('tailwindcss').Config} */
import { skeleton } from '@skeletonlabs/tw-plugin';
import { join } from 'path';
import type { Config } from 'tailwindcss';

const config = {
  theme: {
    extend: {},
  },
  darkMode: 'selector',
	content: [
    "./index.html",'./src/**/*.{svelte,js,ts}',
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve(
			'@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}'
		)
	],
	plugins: [
		skeleton({
			themes: {
				preset: [ {name: "skeleton", enhancements: true} ]
			}
		})
	]
} satisfies Config;

export default config;