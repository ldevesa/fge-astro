/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
	content: [	'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',	],
	darkMode: 'class',
	theme: {
		extend: {},
	},
	plugins: [],
});

