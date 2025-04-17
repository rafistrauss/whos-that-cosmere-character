import { app } from '../firebase';

export const prerender = true;

export async function load({ fetch }) {
    const response = await fetch('/clues.json');

    if (!response.ok) {
        throw new Error('Failed to fetch clues');
    }

    const clues = await response.json();

    return {
        props: {
            clues
        }
    };
}