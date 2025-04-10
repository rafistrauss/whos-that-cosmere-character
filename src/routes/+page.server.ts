import { getFirestore, collection, getDocs } from "firebase/firestore"; 
import { app } from './firebase'; // Adjust the path as necessary

interface Clue {
	names: string[];
	shardcastEp?: string;
	clues: string[];
}

interface GameData {
	clue: Clue;
}

const db = getFirestore(app);

export async function load() {
	const games: GameData[] = [];
	const clues: Clue[] = [];

	try {
		const querySnapshot = await getDocs(collection(db, "clues"));
		querySnapshot.forEach((doc) => {
			const gameData = doc.data() as GameData;
			games.push(gameData);
			clues.push(gameData.clue);
		});
		console.log('Game data fetched successfully');
	} catch (error) {
		console.error('Error fetching game data:', error);
	}

	return {
		games,
		clues
	};
}
