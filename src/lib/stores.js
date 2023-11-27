// place files you want to import through the `$lib` alias in this folder.
import { writable, readable, derived, get} from 'svelte/store';
import { data } from '$lib/data.js';

/* Time Stamps & History */
export const FullTimeLimit = 1200;
let start;
export const confirmedToStay = writable(false);
export const LeisureTime = writable(0.0);
export const leisureStart = writable(0.0);
export const leisurePay = 0.01;
export const GameOver = writable(false);

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
	if (get(GameOver)) {
		uploadData();
		GameOver.set(false);
	}
	else if (t - lastHistoryResetTime >= sendInterval) {
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
function uploadData() {
	const gameArrToSend = JSON.stringify(historyData);
	console.log('Sending experiment result:', gameArrToSend);
	console.log('Type of experiment result:', typeof gameArrToSend);
	window.parent.postMessage({ type: 'gameArr', data: gameArrToSend }, '*');
} 

// Store Data
const eventMapping = {
	"start game": 0,
	"choose work": 1,
	"enter home screen": 2,
	"job available": 3,
	"job expire": 4,
	"start job": 5,
	"guess result": 6,
	"copy paste": 7,
	"finish job": 8,
	"rate": 9,
	"choose leisure": 10,
	"confirm stay in leisure": 11,
	"confirm leave leisure": 12,
	"didn't choose": 13,
	"switch to leisure": 14,
	"switch to work": 15,
	"finish game": 16,
	"switch location": 17
  };
  
  // Count of each event type
const eventCounts = {};

// export function logHistory(message, specific = null) {
// 	console.log('DEBUG', t);
// 	history.update((list) => {
// 	  const eventId = eventMapping[message] || 'unknown_event';
// 	  const eventCount = (eventCounts[eventId] = (eventCounts[eventId] || 0) + 1);
// 	  const eventTime = t || 0.0;
// 	  const eventData = {
// 		time: eventTime.toFixed(3), // Format to 3 decimal places
// 		event_description: eventId,
// 		count: eventCount,
// 		coredata: specific, // This could be a parameter of the function
// 		full_message: message,
// 	  };
// 	  list.push(eventData);
// 	  console.log(list);
// 	  return list;
// 	});
//   }
export function logHistory(eventKey, specific = null, message) {
	console.log('DEBUG', t);
	const eventId = eventMapping[eventKey];
	if (eventId === undefined) {
		console.error(`Unknown event key: ${eventKey}`);
		return;
	}
	const eventCount = (eventCounts[eventId] = (eventCounts[eventId] || 0) + 1);
	const eventTime = t || 0.0;
	const eventData = {
	  time: eventTime.toFixed(3), // Format to 3 decimal places
	  event_id: eventId,
	  count: eventCount,
	  core_data: specific,
	  full_message: message,
	};
	history.update((list) => {
	  list.push(eventData);
	  console.log(list);
	  return list;
	});
}
// export function logHistory(message) {
// 	console.log('DEBUG', t);
// 	history.update((list) => {
// 		list.push({ time: t || 0.0, event: message });
// 		console.log(list);
// 		return list;
// 	});
// }

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
export const changeLocation = writable(false);

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
