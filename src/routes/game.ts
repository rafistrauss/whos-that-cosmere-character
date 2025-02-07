import { games, clues } from './characters';

export class Game {
	index: number;
	guesses: string[];
	cluesGiven: number;
	clues: string[] = [];
	primaryAnswer: string;
	alternateAnswers: string[];

	/**
	 * Create a game object from the player's cookie, or initialise a new game
	 */
	constructor(serialized: string | undefined = undefined) {
		if (serialized) {
			console.log(serialized);
			const [index, guesses, cluesGiven] = serialized.split('-');

			this.index = +index;
			this.guesses = guesses ? guesses.split(' ') : [];
			this.cluesGiven = +cluesGiven;
		} else {
			this.index = Math.floor(Math.random() * games.length);
			this.guesses = [];
			this.cluesGiven = 1;
		}

		this.initializeGameData();
	}

	initializeGameData() {
		const gameData = games[this.index].clue;
		this.primaryAnswer = gameData.names[0];
		this.alternateAnswers = gameData.names.slice(1);
		this.clues = gameData.clues;
	}

	/**
	 * Update game state based on a guess of a character. Returns
	 * true if the guess was correct, false otherwise
	 */
	enter(guess: string) {
		this.guesses.push(guess);

		if ([this.primaryAnswer, ...this.alternateAnswers].some(answer => guess.toLowerCase() === answer.toLowerCase())) {
			return true;
		}

		this.cluesGiven += 1;
		return false;
	}

	/**
	 * Get the next clue for the character
	 */
	getClue(clueIndex: number) {
		return clues[this.index].clues[clueIndex];
	}

	/**
	 * Serialize game state so it can be set as a cookie
	 */
	toString() {
		return `${this.index}-${this.guesses.join(' ')}-${this.cluesGiven}`;
	}
}
