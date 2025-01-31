<script lang="ts">
	import { confetti } from '@neoconfetti/svelte';
	import { Game } from './game';
	import Textfield from '@smui/textfield';
	import Button from '@smui/button';
	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';

	import { onMount } from 'svelte';

	let game: Game;
	let currentGuess = '';
	let won = false;
	let submittable = false;
	let form: any = {};
	let data: any = { clues: [], guesses: [], primaryAnswer: '', alternateAnswers: [] };
	let index: number = 1;
	let reducedMotion: any = { current: false };

	onMount(() => {
		const serializedGame = localStorage.getItem('wtcc');
		game = new Game(serializedGame || undefined);
		initializeData();
		updateState();
		showFirstClue();
	});

	function initializeData() {
		data.guesses = game.guesses;
		data.clues = Array.from({ length: game.cluesGiven }, (_, i) => game.getClue(i));

		data.primaryAnswer = game.primaryAnswer;
		data.alternateAnswers = game.alternateAnswers;
	}

	function updateState() {
		if (!game) return;
		won =
			game.guesses.length > 0 &&
			[game.primaryAnswer, ...game.alternateAnswers].some(
				(answer) => game.guesses[game.guesses.length - 1].toLowerCase() === answer.toLowerCase()
			);
		submittable = currentGuess.length > 0;
		localStorage.setItem('wtcc', game.toString());
	}

	function handleGuess() {
		if (game.enter(currentGuess)) {
			won = true;
		}
		currentGuess = '';
		initializeData();
		updateState();
	}

	function handleKey(event: KeyboardEvent) {
		if (event.key === 'Enter' && submittable) {
			handleGuess();
		}
		updateState();
	}

	function restartGame() {
		localStorage.removeItem('wtcc');
		game = new Game();
		initializeData();
		updateState();
		showFirstClue();
	}

	function showFirstClue() {
		if (data.clues.length === 0) {
			data.clues.push(game.getClue(0));
		}
	}

	$: updateState();
</script>

<svelte:window onkeyup={handleKey} />

<svelte:head>
	<title>Cosmere Character Guessing Game</title>
	<meta name="description" content="A guessing game for Cosmere characters written in SvelteKit" />
</svelte:head>

<h1 class="visually-hidden">Cosmere Character Guessing Game</h1>

<button class="restart selected" on:click={restartGame}> New Game? </button>

<form on:submit|preventDefault={handleGuess}>
	{#if !won && data.clues.length < 5}
		<!-- <input type="text" bind:value={currentGuess} class="guess" /> -->
		<Textfield type="text" bind:value={currentGuess} />
	{/if}
	<!-- <a class="how-to-play" href="/wtcc/how-to-play">How to play</a> -->

	<DataTable class="grid">
		<Head>
			{#each Array.from(Array(5).keys()) as row (row)}
				{@const current = row === index}
				<Row>
					<Cell class="visually-hidden">Clue {row + 1}</Cell>
					<Cell class="clue">{data.clues[row]}</Cell>
					<Cell class="guess">
						{#if data.guesses[row]}
							{data.guesses[row]}
							{#if [data.primaryAnswer, ...data.alternateAnswers].some((answer) => data.guesses[row].toLowerCase() === answer.toLowerCase())}
								<span>✔️</span>
							{:else}
								<span>❌</span>
							{/if}
						{/if}
					</Cell>
				</Row>
			{/each}
		</Head>
	</DataTable>

	<div class="controls">
		{#if won || data.clues.length >= 5}
			{#if data.primaryAnswer}
				<p>
					the answer was "<strong>{data.primaryAnswer}</strong
					>{#if data.alternateAnswers.length > 0}
						(also acceptable: {data.alternateAnswers.join(', ')}){/if}"
				</p>
			{/if}
			<Button data-key="enter" class="restart selected" onclick={restartGame}>
				{won ? 'you won :)' : `game over :(`} play again?
			</Button>
		{:else}
			<Button type="submit" class="submit" disabled={!submittable}>Submit Guess</Button>
		{/if}
	</div>
</form>

{#if won}
	<div
		style="position: absolute; left: 50%; top: 0%"
		use:confetti={{
			particleCount: reducedMotion.current ? 0 : undefined,
			force: 0.3,
			stageWidth: window.innerWidth,
			stageHeight: window.innerHeight,
			colors: ['#ff3e00', '#40b3ff', '#676778']
		}}
	></div>
{/if}

<style>
	form {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		flex: 1;
	}

	.how-to-play {
		color: var(--color-text);
	}

	.how-to-play::before {
		content: 'i';
		display: inline-block;
		font-size: 0.8em;
		font-weight: 900;
		width: 1em;
		height: 1em;
		padding: 0.2em;
		line-height: 1;
		border: 1.5px solid var(--color-text);
		border-radius: 50%;
		text-align: center;
		margin: 0 0.5em 0 0;
		position: relative;
		top: -0.05em;
	}

	:global(.grid) {
		width: 80vw;
		align-self: center;
		justify-self: center;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}

	.grid .row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-gap: 0.2rem;
		margin: 0 0 0.2rem 0;
	}

	.clue {
		background: var(--color-theme-2);
		color: white;
		padding: 0.5rem;
		border-radius: 2px;
	}

	.guess {
		color: black;
		padding: 0.5rem;
		border-radius: 2px;
		background: transparent;
		border: none;
		border-bottom: 2px solid darkgray;
	}

	.controls {
		text-align: center;
		justify-content: center;
		height: min(18vh, 10rem);
	}

	.submit {
		width: 100%;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.5);
		border-radius: 2px;
		border: none;
	}

	.submit:focus,
	.submit:hover {
		background: var(--color-theme-1);
		color: white;
		outline: none;
	}

	.restart {
		width: 100%;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.5);
		border-radius: 2px;
		border: none;
	}

	.restart:focus,
	.restart:hover {
		background: var(--color-theme-1);
		color: white;
		outline: none;
	}
</style>
