/** @type {import('tailwindcss').Config} */
import flowbite from "flowbite-react/tailwind";
import withMT from "@material-tailwind/react/utils/withMT";

export default withMT ({
	content: [
		'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
		flowbite.content(),
	],
	theme: {
		extend: {},
	},
	plugins: [
		flowbite.plugin(),
	],
});