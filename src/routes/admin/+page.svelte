<script lang="ts">
import { onAuthStateChanged, auth } from '../firebase';
import { getFirestore, collection, getDocs, updateDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { app } from '../firebase';
import { signInWithEmailAndPassword, signOut } from '../firebase';
import type { User } from 'firebase/auth';
import { onMount } from 'svelte';

let user: User | null = null;
interface Clue {
    id: string;
    names: string[];
    approved: boolean;
}

let pendingClues: Clue[] = [];
let approvedClues: Clue[] = [];
const db = getFirestore(app);

let email = '';
let password = '';

let approvalsEnabled: boolean | null = null;

onAuthStateChanged(auth, (currentUser) => {
    user = currentUser;
    if (user) {
        fetchClues();
        fetchApprovalsStatus();
    }
});

async function fetchClues() {
    const querySnapshot = await getDocs(collection(db, 'clues'));
    pendingClues = [];
    approvedClues = [];

    querySnapshot.forEach((doc) => {
        const clue = { id: doc.id, ...doc.data() };
        console.log(clue);
        
        if (clue.approved) {
            approvedClues.push(clue);
        } else {
            pendingClues.push(clue);
        }
    });
}

async function approveClue(id: string) {
    const clueRef = doc(db, 'clues', id);
    await updateDoc(clueRef, { approved: true });
    fetchClues();
}

async function denyClue(id: string) {
    const clueRef = doc(db, 'clues', id);
    await deleteDoc(clueRef);
    fetchClues();
}

async function deleteApprovedClue(id: string) {
    const clueRef = doc(db, 'clues', id);
    await deleteDoc(clueRef);
    fetchClues();
}

async function login() {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Logged in successfully!');
    } catch (error) {
        console.error('Login failed:', error);
        alert('Failed to log in.');
    }
}

async function logout() {
    try {
        await signOut(auth);
        alert('Logged out successfully!');
    } catch (error) {
        console.error('Logout failed:', error);
        alert('Failed to log out.');
    }
}

async function fetchApprovalsStatus() {
    const docRef = doc(db, 'approvals', 'enabled');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        approvalsEnabled = docSnap.data().enabled;
    } else {
        console.error('No such document!');
    }
}

async function toggleApprovalsStatus() {
    if (approvalsEnabled !== null) {
        const docRef = doc(db, 'approvals', 'enabled');
        await updateDoc(docRef, { enabled: !approvalsEnabled });
        approvalsEnabled = !approvalsEnabled;
    }
}

onMount(() => {
    fetchApprovalsStatus();
});
</script>

<style>
    button {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;
    }

    button:hover {
        transform: scale(1.05);
    }

    button:active {
        transform: scale(0.95);
    }

    .approvals-status {
        font-weight: bold;
    }

    .approvals-status.open {
        color: green;
    }

    .approvals-status.closed {
        color: red;
    }

    .toggle-button.closed {
        background-color: green;
        color: white;
    }

    .toggle-button.open {
        background-color: red;
        color: white;
    }

    .approve-button {
        background-color: blue;
        color: white;
    }

    .approve-button:hover {
        background-color: darkblue;
    }

    .deny-button {
        background-color: darkred;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;
    }

    .deny-button:hover {
        background-color: crimson;
        transform: scale(1.05);
    }

    .deny-button:active {
        transform: scale(0.95);
    }
</style>

{#if user}
    <h1>Admin Panel</h1>
    <button on:click={logout}>Logout</button>

    <h2>Pending Clues</h2>
    {#if pendingClues.length > 0}
        <ul>
            {#each pendingClues as clue}
                <li>
                    <details>
                        <summary>
                            {#if Array.isArray(clue.clue?.names)}
                                {clue.clue.names.join(', ')}
                            {:else}
                                <em>Invalid clue data</em>
                            {/if}
                        </summary>
                        <ul>
                            {#each clue.clue?.clues as clueText}
                                <li>{clueText}</li>
                            {/each}
                        </ul>
                    </details>
                    <button class="approve-button" on:click={() => approveClue(clue.id)}>Approve</button>
                    <button class="deny-button" on:click={() => denyClue(clue.id)}>Deny</button>
                </li>
            {/each}
        </ul>
    {:else}
        <p>No pending clues.</p>
    {/if}

    <h2>Approved Clues</h2>
    {#if approvedClues.length > 0}
        <ul>
            {#each approvedClues as clue}
                <li>
                    {#if Array.isArray(clue.clue?.names)}
                        {clue.clue.names.join(', ')}
                    {:else}
                        <em>Invalid clue data</em>
                    {/if}
                    <button class="deny-button" on:click={() => deleteApprovedClue(clue.id)}>Delete</button>
                </li>
            {/each}
        </ul>
    {:else}
        <p>No approved clues.</p>
    {/if}

    <h2>Approvals Status</h2>
    {#if approvalsEnabled !== null}
        <p class="approvals-status {approvalsEnabled ? 'open' : 'closed'}">
            Approvals are currently {approvalsEnabled ? 'Enabled' : 'Disabled'}.
        </p>
        <button class="toggle-button {approvalsEnabled ? 'open' : 'closed'}" on:click={toggleApprovalsStatus}>
            {approvalsEnabled ? 'Disable' : 'Enable'} Approvals
        </button>
    {:else}
        <p>Loading approvals status...</p>
    {/if}
{:else}
    <h1>Login</h1>
    <form on:submit|preventDefault={login}>
        <label>
            Email:
            <input type="email" bind:value={email} required />
        </label>
        <label>
            Password:
            <input type="password" bind:value={password} required />
        </label>
        <button type="submit">Login</button>
    </form>
{/if}