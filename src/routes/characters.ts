import { getFirestore, collection, getDocs } from "firebase/firestore"; 
import { app } from './firebase'; // Import Firebase app initialization

interface Clue {
	names: string[];
	shardcastEp?: string;
	clues: string[];
}

interface GameData {
	clue: Clue;
}

const db = getFirestore(app);

const games: GameData[] = [];
const clues: Clue[] = [];

async function fetchAllGameData(): Promise<void> {
	const querySnapshot = await getDocs(collection(db, "clues"));
	querySnapshot.forEach((doc) => {
		const gameData = doc.data() as GameData;
		games.push(gameData);
		clues.push(gameData.clue);
	});
}

// Call the async function to fetch data
fetchAllGameData().then(() => {
	console.log('Game data fetched successfully');
	console.log(games, clues);
}).catch((error) => {
	console.error('Error fetching game data:', error);
});

console.log(games, clues);

export { games, clues };