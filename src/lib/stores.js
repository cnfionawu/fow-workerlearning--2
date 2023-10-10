// place files you want to import through the `$lib` alias in this folder.
import { writable, readable, derived } from 'svelte/store';

export const earned = writable(0);
export const history = writable([]);
export const game = writable({
	inGame: false
});

export function startGame(isUberEats, earnings, numSteps, timeLimit) {
	console.log('Starting');

	game.set({
		inGame: true,
		isUberEats: true,
		earnings: earnings,
		numSteps: numSteps,
		timeLimit: timeLimit
	});
}
export function endGame(gained) {
	console.log('Ending');

	earned.update((n) => n + gained );

	game.set({
		inGame: false
	});
}

export const time = readable(new Date(), function start(set) {
	const interval = setInterval(() => {
		set(new Date());
	}, 100);

	return function stop() {
		clearInterval(interval);
	};
});

let start = new Date();

export const timeStamp = derived(time, ($time) => $time - start);
export const elapsed = derived(time, ($time) => $time - start);
