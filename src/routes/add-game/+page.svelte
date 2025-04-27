<script lang="ts">
	import Textfield from '@smui/textfield';
	import Button from '@smui/button';
	import { getFirestore, collection, addDoc, doc, getDoc } from 'firebase/firestore';
	import { app } from '../firebase';
	import { onMount } from 'svelte';

	export let data;

	// Use the pre-fetched data
	const { clues } = data;

	const db = getFirestore(app);

	let newGame = {
		primaryAnswer: '',
		alternateAnswers: [], // Initialize with one empty string
		clues: clues || ['', '', '', '', '']
	};

	let jsonInput = '';

	let approvalsEnabled: boolean | null = null;

	async function fetchApprovalsStatus() {
		const docRef = doc(db, 'approvals', 'enabled');
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			approvalsEnabled = docSnap.data().enabled;
		} else {
			console.error('No such document!');
		}
	}

	onMount(() => {
		fetchApprovalsStatus();
	});

	function populateFromJson() {
		try {
			const parsed = JSON.parse(jsonInput);
			if (parsed.primaryAnswer) newGame.primaryAnswer = parsed.primaryAnswer;
			if (Array.isArray(parsed.alternateAnswers)) newGame.alternateAnswers = parsed.alternateAnswers;
			if (Array.isArray(parsed.clues)) newGame.clues = parsed.clues;
			alert('Fields populated successfully!');
		} catch (error) {
			console.error('Invalid JSON:', error);
			alert('Failed to parse JSON. Please check the format.');
		}
	}

	function addAlternateAnswer() {
		newGame.alternateAnswers = [...newGame.alternateAnswers, '']; // Reassign to trigger reactivity
        console.log('New alternate answer added:', newGame.alternateAnswers);
	}

	function removeAlternateAnswer(index: number) {
		newGame.alternateAnswers = newGame.alternateAnswers.filter((_, i) => i !== index); // Reassign to trigger reactivity
	}

	async function submitNewGame(event: Event) {
		event.preventDefault();
		try {
			// Parse alternate answers and clues into the correct schema
			const gameData = {
				clue: {
					names: [newGame.primaryAnswer, ...newGame.alternateAnswers.filter(answer => answer.trim() !== '')],
					shardcastEp: '', // Add shardcast episode if applicable
					clues: newGame.clues.filter(clue => clue.trim() !== ''),
					approved: false // Set to false initially
				}
			};

			// Add the new game to the Firestore collection
			await addDoc(collection(db, 'clues'), gameData);

			alert('Thanks for submitting a game! It should be ready to play once approved');
			newGame = { primaryAnswer: '', alternateAnswers: [''], clues: ['', '', '', '', ''] };
		} catch (error) {
			console.error('Error submitting game:', error);
			alert('An error occurred while submitting the game.');
		}
	}
</script>

<h1>Submit a New Game</h1>

{#if approvalsEnabled === false}
	<p style="color: red; font-weight: bold; text-align: center;">
		Submission of new clues has been paused for maintenance. Please try again later.
	</p>
{:else if approvalsEnabled === true}
	<form onsubmit={submitNewGame}>
		<Textfield
			bind:value={newGame.primaryAnswer}
			label="Primary Answer"
			style="width: 100%;"
			required
		/>

		{#if newGame.alternateAnswers.length > 0}
			<h2>Alternate Answers</h2>
			{#each newGame.alternateAnswers as answer, index}
				<div style="display: flex; align-items: center; gap: 1rem;">
					<Textfield
						bind:value={newGame.alternateAnswers[index]}
						label={`Alternate Answer ${index + 1}`}
						style="width: 100%;"
					/>
					<Button type="button" onclick={() => removeAlternateAnswer(index)}>Remove</Button>
				</div>
			{/each}
		{/if}
		<Button type="button" onclick={addAlternateAnswer}>Add Alternate Answer</Button>

		<h2>Clues</h2>
		{#each newGame.clues as clue, index}
			<Textfield
				bind:value={newGame.clues[index]}
				label={`Clue ${index + 1}`}
				style="width: 100%;"
				required
			/>
		{/each}

		{#if import.meta.env.MODE === 'development'}
			<h2>JSON Input</h2>
			<Textfield
				bind:value={jsonInput}
				label="Paste JSON here"
				style="width: 100%;"
			/>
			<Button type="button" onclick={populateFromJson}>Populate Fields</Button>
		{/if}

		<Button type="submit">Submit Game</Button>
	</form>
{:else}
	<p>Loading...</p>
{/if}

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 800px;
		width: 90%;
		margin: auto;
	}

	form > * {
		width: 100%;
	}
</style>
