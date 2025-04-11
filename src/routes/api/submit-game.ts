import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../firebase";
import type { RequestHandler } from "@sveltejs/kit";

const db = getFirestore(app);

export const POST: RequestHandler = async ({ request }) => {
    try {
        const newGame = await request.json();

        // Parse alternate answers into an array
        newGame.alternateAnswers = newGame.alternateAnswers
            ? newGame.alternateAnswers.split(",").map((answer: string) => answer.trim())
            : [];

        // Add the new game to the Firestore collection
        await addDoc(collection(db, "clues"), newGame);

        return new Response(JSON.stringify({ message: "Game submitted successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error submitting game:", error);
        return new Response(JSON.stringify({ error: "Failed to submit game" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};