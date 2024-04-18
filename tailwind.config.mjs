/** @type {import('tailwindcss').Config} */

import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
	content: [	'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',	],
	theme: {
		extend: {},
	},
	plugins: [],
});

