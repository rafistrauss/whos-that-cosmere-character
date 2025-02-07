import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			// TODO: add a 404 page
			// fallback: '404.html'
		}),
		paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH,
			assets: process.argv.includes('dev') ? '' : 'https://rafistrauss.github.io/whos-that-cosmere-character'
		}
	},
};

export default config;