// place files you want to import through the `$lib` alias in this folder.
import { writable, readable, derived } from 'svelte/store';

export const earned = writable(0);
export const history = writable([]);
export const game = writable({
	inGame: false
});

export function startGame() {
	console.log("Starting");
	game.set({
		inGame: true
	})
}
export function endGame() {
	console.log("Ending");
	game.set({
		inGame: false
	})
}

export const time = readable(new Date(), function start(set) {
	const interval = setInterval(() => {
		set(new Date());
	}, 1000);

	return function stop() {
		clearInterval(interval);
	};
});

let start = new Date();

export function resetTimer() {
	start = new Date();
}

export const elapsed = derived(time, ($time) => Math.round(($time - start) / 1000));
