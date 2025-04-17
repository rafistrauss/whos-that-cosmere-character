import { writeFileSync } from 'fs';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../routes/firebase';
import { deleteApp } from 'firebase/app';

async function generateStaticData() {
	const db = getFirestore(app);
	const cluesCollection = collection(db, 'clues');
	const snapshot = await getDocs(cluesCollection);

	const clues = snapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	}));

	writeFileSync('static/clues.json', JSON.stringify(clues, null, 2));

	deleteApp(app);

}

await generateStaticData();
