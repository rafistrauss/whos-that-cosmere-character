import { games, clues } from './characters';

export class Game {
	index: number;
	guesses: string[];
	cluesGiven: number;
	primaryAnswer: string;
	alternateAnswers: string[];

	/**
	 * Create a game object from the player's cookie, or initialise a new game
	 */
	constructor(serialized: string | undefined = undefined) {
		if (serialized) {
			const [index, guesses, cluesGiven] = serialized.split('-');

			this.index = +index;
			this.guesses = guesses ? guesses.split(' ') : [];
			this.cluesGiven = +cluesGiven;
		} else {
			this.index = Math.floor(Math.random() * games.length);
			this.guesses = [];
			this.cluesGiven = 0;
		}

		this.primaryAnswer = games[this.index].names[0];
		this.alternateAnswers = games[this.index].names.slice(1);
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
		return clues[this.index][clueIndex];
	}

	/**
	 * Serialize game state so it can be set as a cookie
	 */
	toString() {
		return `${this.index}-${this.guesses.join(' ')}-${this.cluesGiven}`;
	}
}
