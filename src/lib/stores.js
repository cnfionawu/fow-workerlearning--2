// place files you want to import through the `$lib` alias in this folder.
import { writable, readable, derived, get} from 'svelte/store';
import { data } from '$lib/data.js';

/* Time Stamps & History */
export const FullTimeLimit = 12000;
let start;
export const confirmedToStay = writable(false);
export const LeisureTime = writable(0.0);
export const leisurePay = 0.01;

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

// Send history to qualtircs
let t;
let lastHistoryResetTime = 0;
const sendInterval = 60;

timeStamp.subscribe((v) => {
	t = v / 1000;
	if (t - lastHistoryResetTime >= sendInterval) {
		lastHistoryResetTime = t;
		uploadData();
		restartHistory();
	}
});

export function restartHistory() {
	history.set([]);
}

let historyData = [];
const historydata = history.subscribe(($history) => {
  historyData = $history; 
})
// export const print = writable([]);
function uploadData() {
	const gameArrToSend = JSON.stringify(historyData);
	// print.set([gameArrToSend]);
	console.log('Sending experiment result:', gameArrToSend);
	console.log('Type of experiment result:', typeof gameArrToSend);
	window.parent.postMessage({ type: 'gameArr', data: gameArrToSend }, '*');
} 

export function logHistory(message) {
	console.log('DEBUG', t);
	history.update((list) => {
		list.push({ time: t || 0.0, event: message });
		console.log(list);
		return list;
	});
}

/* Home Screen Jobs */
export const jobs = writable([
	{
		id: 0,
		waitTime: null,
		timeLimit: null,
		type: 'UberEats',
		city: 'SF',
		index: null,
		data: null,
		avgWait: 15,
		avgEarnings: 40,
		avgItems: 13,
		ready: false, 
        expired: false
	},
	{
		id: 1,
		waitTime: null,
		timeLimit: null,
		type: 'Uber',
		city: 'SF',
		index: null,
		data: null,
		avgWait: 5,
		avgEarnings: 20,
		avgItems: 10,
		ready: false, 
        expired: false
	},
	{
		id: 2,
		waitTime: null,
		timeLimit: null,
		type: 'UberEats',
		city: 'Berkeley',
		index: null,
		data: null,
		avgWait: 20,
		avgEarnings: 40,
		avgItems: 13,
		ready: false, 
        expired: false
	},
	{
		id: 3,
		waitTime: null,
		timeLimit: null,
		type: 'Uber',
		city: 'Berkeley',
		index: null,
		data: null,
		avgWait: 10,
		avgEarnings: 20,
		avgItems: 10,
		ready: false, 
        expired: false
	}
]);

export function generateData() {
	jobs.update(currentJobs => {
	  for (let i = 0; i < 4; i++) {
		if (currentJobs[i].waitTime === null && currentJobs[i].timeLimit === null) {
		  const index = Math.floor(Math.random() * data[i].length);
		  const random_dataPt = data[i][index];
		  currentJobs[i].data = random_dataPt;
		  currentJobs[i].waitTime = random_dataPt[0];
		  currentJobs[i].timeLimit = random_dataPt[1];
		  currentJobs[i].index = [i, index];
		  console.log('update:' + currentJobs[i].type + currentJobs[i].city);
		  console.log('updated job:' + currentJobs[i].waitTime + ' ' + currentJobs[i].timeLimit);
		}
	  }
	  return currentJobs;
	});
}
  
export function generateSingleData(id) {
	jobs.update(currentJobs => {
		const index = Math.floor(Math.random() * data[id].length);
		const random_dataPt = data[id][index];
		currentJobs[id].data = random_dataPt;
		currentJobs[id].waitTime = random_dataPt[0];
		currentJobs[id].timeLimit = random_dataPt[1];
		currentJobs[id].index = [id, index];
		currentJobs[id].ready = false;
		currentJobs[id].expired = false;
		console.log('update:' + currentJobs[id].type + currentJobs[id].city);
		console.log('updated job:' + currentJobs[id].waitTime + ' ' + currentJobs[id].timeLimit);
		console.log(get(jobs));
		return currentJobs;
	});
}
/* Game State */

export const earned = writable(0);
export const currLocation = writable('Berkeley');

export const game = writable({
	inGame: false,
	inSummary: false,
	inChoices: false,
	inLeisure: false,
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

	// earned.update((n) => n + gained);
	earned.update((n) => {
		const updatedValue = parseFloat((n + gained).toFixed(2));
		return updatedValue;
	});

	gameState.inGame = false;
	gameState.inSummary = true;
	game.set(gameState);
}

export const elapsed = derived(timeStamp, ($timeStamp) => Math.round($timeStamp / 1000));
