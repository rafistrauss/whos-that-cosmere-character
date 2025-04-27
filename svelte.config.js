import adapter from '@sveltejs/adapter-static';

const isCI = process.env.CI === 'true';

console.log(`isCI: ${isCI}`);

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			// TODO: add a 404 page
			// fallback: '404.html'
		}),
		paths: {
			base: isCI ? process.env.BASE_PATH : '',
			assets: isCI ? 'https://rafistrauss.github.io/whos-that-cosmere-character' : ''
		}
	},
};

export default config;