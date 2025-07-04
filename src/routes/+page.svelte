<script lang="ts">
	import { confetti } from '@neoconfetti/svelte';
	import { Game } from './game';
	import Textfield from '@smui/textfield';
	import Button from '@smui/button';
	import DataTable, { Body, Row, Cell } from '@smui/data-table';
	import { writable } from 'svelte/store';

	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	let { data: pageProps }: PageProps = $props();

	let { games } = pageProps;

	let game: Game;
	let currentGuess = $state('');
	let won = $state(false);
	let submittable = $derived(currentGuess.length > 0);
	let form: any = {};
	const data = writable({ clues: [], guesses: [], primaryAnswer: '', alternateAnswers: [] });
	let index: number = 1;
	let reducedMotion: any = { current: false };
	let gameNumber = $state(1);

	let gameplayInstructions = `Welcome to the Cosmere Character Guessing Game! Here's how to play:
	1. Select a game from the dropdown or start a new one.
	2. You will be given clues about a character from the Cosmere universe.
	3. Use the clues to guess the character's name.
	4. Type your guess in the input field and submit it.
	5. If your guess is correct, you win! Otherwise, try again with another clue.
	6. You have a maximum of 5 guesses per game.`;

	// Updated `showInstructions` to use `$state` for reactivity
	let showInstructions = $state(false);

	onMount(() => {
		const serializedGame = localStorage.getItem('wtcc');
		game = new Game(games, serializedGame || undefined);

		updateState();
		initializeData();
		showFirstClue();
	});

	function initializeData() {
		gameNumber = game.index + 1;
		data.update((d) => {
			d.guesses = game.guesses;
			d.clues = Array.from({ length: game.cluesGiven }, (_, i) => game.getClue(i));
			console.log('initial data.clues', d.clues);

			if (won) {
				d.clues = Array.from({ length: 5 }, (_, i) => game.getClue(i));
			}

			d.primaryAnswer = game.primaryAnswer;
			d.alternateAnswers = game.alternateAnswers;
			return d;
		});
	}

	function updateState() {
		if (!game) return;
		won =
			game.guesses.length > 0 &&
			[game.primaryAnswer, ...game.alternateAnswers].some(
				(answer) => game.guesses[game.guesses.length - 1].toLowerCase() === answer.toLowerCase()
			);
		localStorage.setItem('wtcc', game.toString());
	}

	function handleGuess(event: SubmitEvent | KeyboardEvent) {
		event.preventDefault();
		if (game.enter(currentGuess)) {
			won = true;
		}
		currentGuess = '';
		initializeData();
		updateState();
	}

	function handleKey(event: KeyboardEvent) {
		if (event.key === 'Enter' && submittable) {
			handleGuess(event);
		}
		updateState();
	}

	function restartGame() {
		localStorage.removeItem('wtcc');
		game = new Game(games);
		won = false; // Reset the won state
		initializeData();
		updateState();
		showFirstClue();
	}

	function showFirstClue() {
		data.update((d) => {
			if (d.clues.length === 0) {
				const clue = game.getClue(0);
				console.log('Adding first clue:', clue);
				d.clues.push(clue);
			}
			return d;
		});
	}
</script>

<svelte:window onkeyup={handleKey} />

<svelte:head>
	<title>Cosmere Character Guessing Game</title>
	<meta name="description" content="A guessing game for Cosmere characters written in SvelteKit" />
</svelte:head>

<h1 class="visually-hidden">Cosmere Character Guessing Game</h1>

<div class="mdc-typography--headline3">Current game: {gameNumber} / {games.length}</div>

<div class="game-selector">
	<label for="game-number">Choose a game:</label>
	<input
		id="game-number"
		type="number"
		min="1"
		max={games.length}
		bind:value={gameNumber}
		onchange={() => {
			game = new Game(games, String(gameNumber - 1));
			won = false; // Reset the won state
			initializeData();
			updateState();
			showFirstClue();
		}}
	/>
</div>

<Button class="restart selected" onclick={restartGame}>New Game?</Button>

<div class="instructions">
	<Button onclick={() => (showInstructions = !showInstructions)}>
		{showInstructions ? 'Hide Instructions' : 'Show Instructions'}
	</Button>
	{#if showInstructions}
		<div class="instructions-content">
			<pre>{gameplayInstructions}</pre>
		</div>
	{/if}
</div>

{#if !won && $data.guesses.length < 5}
	<form class="guess-and-answer-container" onsubmit={handleGuess}>
		<Textfield
			type="text"
			bind:value={currentGuess}
			label="Type guess here"
			style="min-width: 50vw"
		/>
	</form>
{:else}
	<div class="guess-and-answer-container">
		{#if $data.primaryAnswer}
			<p>
				the answer was "<strong>{$data.primaryAnswer}</strong
				>{#if $data.alternateAnswers.length > 0}
					(also acceptable: {$data.alternateAnswers.join(', ')}){/if}"
			</p>
		{/if}
	</div>
{/if}

<DataTable class="grid">
	<Body>
		{#each Array.from(Array(5).keys()) as row (row)}
			{@const current = row === index}

			<Row>
				<Cell class="status">
					{#if $data.guesses[row]}
						{#if [$data.primaryAnswer, ...$data.alternateAnswers].some((answer) => $data.guesses[row].toLowerCase() === answer.toLowerCase())}
							<span>✔️</span>
						{:else}
							<span>❌</span>
						{/if}
					{/if}
				</Cell>
				<Cell class="clue">{$data.clues[row]}</Cell>
				<Cell class="guess">
					{#if $data.guesses[row]}
						{$data.guesses[row]}
					{/if}
				</Cell>
			</Row>
		{/each}
	</Body>
</DataTable>

<div class="controls">
	{#if won || $data.guesses.length >= 5}
		<Button data-key="enter" class="restart selected" onclick={restartGame}>
			{won ? 'you won :)' : `game over :(`} play again?
		</Button>
	{:else}
		<Button onclick={handleGuess} type="submit" class="submit" disabled={!submittable}>Submit Guess</Button>
	{/if}
</div>

{#if won}
	<div style="height: 100vh; width: 100vw; position: fixed; top: 0; left: 0; overflow: hidden; pointer-events: none;">
		<div
			style="position: absolute; left: 50%; top: 0%;"
			use:confetti={{
				particleCount: reducedMotion.current ? 0 : undefined,
				force: 0.5,
				stageWidth: window.innerWidth,
				stageHeight: window.innerHeight,
				colors: ['#ffd400', '#4075a6']
			}}
		></div>
	</div>
{/if}

<style>
	:global(body) {
		overflow-x: hidden;
	}

	.status {
		width: 1em;
	}
	.guess-and-answer-container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		padding: 5em 0;
		padding-top: 2.5em
		min-height: 10rem; /* Ensures consistent vertical space */
	}

	/* Adjust table layout for better responsiveness */
	:global(.grid) {
		overflow-x: auto;
		width: 100%;
		border: none; /* Hide table gridlines */
	}

	:global(.grid table) {
		width: 100%;
		border-collapse: collapse;
		border: none; /* Hide table gridlines */
	}

	:global(.grid th),
	:global(.grid td) {
		padding: 0.5rem;
		text-align: left;
		border: none; /* Hide table gridlines */
		vertical-align: top; /* Allow content to expand vertically */
	}

	/* Ensure the first column is wide enough */
	:global(.grid .status) {
		width: 2em;
		text-align: center;
	}

	/* Allow the clue column to expand vertically */
	:global(.grid .clue) {
		white-space: normal;
		word-wrap: break-word;
	}

	/* Make the 3rd column (guess) more responsive */
	:global(.grid .guess) {
		white-space: normal;
		word-wrap: break-word;
		max-width: 100%;
	}

	/* Ensure table is scrollable on smaller screens */
	@media (max-width: 768px) {
		:global(.grid) {
			overflow-x: scroll;
		}
	}

	.controls {
		text-align: center;
		justify-content: center;
		height: min(18vh, 10rem);
	}

	.instructions {
		text-align: center;
		margin: 1rem 0;
	}

	.instructions-content {
		margin-top: 1rem;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 5px;
	}

	.instructions-content pre {
		background-color: transparent;
		color: inherit;
	}
</style>
