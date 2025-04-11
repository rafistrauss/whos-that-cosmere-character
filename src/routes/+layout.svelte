<script lang="ts">
	import { base } from '$app/paths';
	import Header from './Header.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="stylesheet" href="{base}/smui.css" media="(prefers-color-scheme: light)" />
	<link
		rel="stylesheet"
		href="{base}/smui-dark.css"
		media="screen and (prefers-color-scheme: dark)"
	/>
</svelte:head>

<div class="app">
	<Header />

	<main>
		{@render children()}
	</main>

	<footer>
		<p style="font-size: small;">
			Disclaimer: This is a fan-made site and is not affiliated with Brandon Sanderson or Dragonsteel Entertainment. All rights to the characters and stories mentioned belong to their respective owners.
		</p>
	</footer>
</div>

<style>
	:global(body) {
		background-color: white;
		color: black;
		
	}

	@media (prefers-color-scheme: dark) {
		:global(body) {
			background-color: black;
			color: white;
		}
	}

	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}


	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
