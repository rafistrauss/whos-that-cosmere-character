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
				<Cell class="visually-hidden">Clue {row + 1}</Cell>
				<Cell class="clue">{$data.clues[row]}</Cell>
				<Cell class="guess">
					{#if $data.guesses[row]}
						{$data.guesses[row]}
						{#if [$data.primaryAnswer, ...$data.alternateAnswers].some((answer) => $data.guesses[row].toLowerCase() === answer.toLowerCase())}
							<span>✔️</span>
						{:else}
							<span>❌</span>
						{/if}
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
		<Button type="submit" class="submit" disabled={!submittable}>Submit Guess</Button>
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
				colors: ['#ff3e00', '#40b3ff', '#676778']
			}}
		></div>
	</div>
{/if}

<style>
	:global(body) {
		overflow-x: hidden;
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
		min-height: 10rem; /* Ensures consistent vertical space */
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

	.controls {
		text-align: center;
		justify-content: center;
		height: min(18vh, 10rem);
	}
</style>
