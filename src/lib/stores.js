// place files you want to import through the `$lib` alias in this folder.
import { writable, readable, derived } from 'svelte/store';

export const earned = writable(0);
export const history = writable([]);
export const game = writable({
	inGame: false,
	inSummary: false,
});

export function startGame(isUberEats, earnings, numSteps, timeLimit, hardLimit) {
	console.log('Starting');

	game.set({
		inGame: true,
		title: isUberEats,
		isUberEats: isUberEats.includes("UberEats"),
		earnings: earnings,
		numSteps: numSteps,
		timeLimit: timeLimit,
		hardLimit: hardLimit
	});
	console.log(isUberEats.includes("UberEats"));
	
}
export function endGame(gained) {
	console.log('Ending');

	earned.update((n) => n + gained );

	game.set({
		inGame: false,
		inSummary: true
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
