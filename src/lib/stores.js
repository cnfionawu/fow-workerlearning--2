// place files you want to import through the `$lib` alias in this folder.
import { writable, readable, derived } from 'svelte/store';
import {data} from '../data/data.js';

// Data
export function randomPick(list) {
	const randomIndex = Math.floor(Math.random() * list.length);
    return randomIndex;
}
const jobData = [
	{ title: 'UberEats (Berkeley)'},
	{ title: 'Uber (Berkeley)'},
	{ title: 'Uber (SF)'},
	{ title: 'UberEats (SF)'},
  ];

export function UpdateJobs(indices) {
	const updatedJobData = [...jobData]; // Create a copy of the original jobData
  
	indices.forEach((index, i) => {
		const curindex = [i, index];
		let numtask = 0;
		const [waittime, time] = data[i][index];
		const timelimit = Math.round(time / 2);
		const earning = time;
		const hardlimit = time*2;
		
		if (i === 0 || i === 3) {
			numtask = Math.round(timelimit / 3);
		  } else {
			numtask = Math.round(timelimit / 2);
		  }
		console.log(numtask);

		updatedJobData[i] = {
			...updatedJobData[i],
			earning: earning,
			timeLimit: timelimit,
			numSteps: numtask,
			waitTime: waittime,
			hardLimit: hardlimit,
			index: curindex
		}
	  

	});
  
	return updatedJobData;
  }



/* Time Stamps & History */

let start;

export function resetTimer() {
	start = new Date();
}

const time = readable(new Date(), function start(set) {
	const interval = setInterval(() => {
		set(new Date());
	}, 10);

	return function stop() {
		clearInterval(interval);
	};
});

export const timeStamp = derived(time, ($time) => $time - start);

export const history = writable([]);

let t;
timeStamp.subscribe((v) => {
	t = v / 1000;
});

export function logHistory(message) {
	console.log('DEBUG', t);
	history.update((list) => {
		list.push({ time: t || 0.0, event: message });
		console.log(list);
		return list;
	});
}

/* Game State */

export const earned = writable(0);
export const game = writable({
	inGame: false,
	inSummary: false
});

export function startGame(isUberEats, earnings, numSteps, timeLimit, hardLimit) {
	console.log('Starting');

	game.set({
		inGame: true,
		title: isUberEats,
		isUberEats: isUberEats.includes('UberEats'),
		earnings: earnings,
		numSteps: numSteps,
		timeLimit: timeLimit,
		hardLimit: hardLimit
	});
	console.log(isUberEats.includes('UberEats'));
}

export function endGame(gained, gameState) {
	console.log('Ending');

	earned.update((n) => n + gained);

	// game.set({
	// 	inGame: false,
	// 	inSummary: true
	// });
	gameState.inGame = false;
	gameState.inSummary = true;
	game.set(gameState);
}

export const elapsed = derived(timeStamp, ($timeStamp) => Math.round($timeStamp / 1000));

