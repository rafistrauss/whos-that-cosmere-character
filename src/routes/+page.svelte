<script lang="ts">
	import { confetti } from '@neoconfetti/svelte';
	import { Game } from './game';
	import Textfield from '@smui/textfield';
	import Button from '@smui/button';
	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';

	import { onMount } from 'svelte';
	import { games } from './characters';

	let game: Game;
	let currentGuess = '';
	let won = false;
	let submittable = false;
	let form: any = {};
	let data: any = { clues: [], guesses: [], primaryAnswer: '', alternateAnswers: [] };
	let index: number = 1;
	let reducedMotion: any = { current: false };
	let gameNumber = 1;

	onMount(() => {
		const serializedGame = localStorage.getItem('wtcc');
		game = new Game(serializedGame || undefined);

		console.log('game', game);
		
		initializeData();
		updateState();
		showFirstClue();
	});

	function initializeData() {
		gameNumber = game.index + 1;
		data.guesses = game.guesses;
		data.clues = Array.from({ length: game.cluesGiven }, (_, i) => game.getClue(i));

		if (won) {
			data.clues = Array.from({ length: 5 }, (_, i) => game.getClue(i));
		}

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

<div class="mdc-typography--headline3">Current game: {gameNumber} / {games.length}</div>


<Button class="restart selected" onclick={restartGame}> New Game? </Button>

<form on:submit|preventDefault={handleGuess}>
	{#if !won && data.guesses.length < 5}
		<!-- <input type="text" bind:value={currentGuess} class="guess" /> -->
		<Textfield type="text" bind:value={currentGuess} label="Type guess here" style="min-width: 50vw" />
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
		{#if won || data.guesses.length >= 5}
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
			force: 0.5,
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
