<script>
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { startGame, logHistory, currLocation, elapsed, generateSingleData, FullTimeLimit, jobs } from '$lib/stores.js';
	import { data } from '$lib/data.js';
	

	const SECONDS_PER_JOB_UBER = 2;
	const SECONDS_PER_JOB_UBEREats = 3;
	const expirationTime = 20;

	export let jobData;
	export let color;

	const title = `${jobData.type} - ${jobData.city}`;
	let countdown = jobData.waitTime;
	let numSteps = jobData.timeLimit;
	let avgWait = jobData.avgWait;
	let avgEarnings = jobData.avgEarnings;
	let avgItems = jobData.avgItems;
	let timeLimit = jobData.timeLimit;
	let id = jobData.id;

	let previousWaitTime = jobData.waitTime; 
	$: if (jobData.waitTime !== previousWaitTime && jobData.ready === false) {
		countdown = jobData.waitTime; // reset the countdown to the new waitTime
		previousWaitTime = jobData.waitTime; 
	}

	// calculate number of tasks based on job type
	if (jobData.type == 'UberEats') {
			numSteps = Math.floor(numSteps / SECONDS_PER_JOB_UBEREats);
	} else {
		console.log(numSteps);
		numSteps = Math.floor(numSteps / SECONDS_PER_JOB_UBER);
		console.log(numSteps);
	}
	
	let earnings = jobData.timeLimit;
	let curTime = null;

// 	const resetJob = () => {
// 		curTime = null;
// 		countdown = jobData.waitTime;
// 		expired = false;
// 		ready = false;
//   };
// 	onMount(() => {
// 		expirationTimer = setInterval(() => {
// 		if (countdown > 0) {
// 			countdown--;

// 			if (countdown === 0) {
// 			// Job is ready
// 				logHistory
// 				curTime = get(elapsed);
// 				ready = true;
// 			}
// 		} else if (curTime !== null) {
// 			const elapsedTime = get(elapsed);
// 			if (elapsedTime - curTime >= expirationTime) {
// 			// Job has expired
// 				expired = true;
// 				ready = false; // Set ready to false when the job expires
// 				curTime = null; // Reset the current time
// 				logHistory(`i:(${jobData.index}) Job ${title} has expired`);
// 				generateSingleData(id);
// 				console.log('curr info:'+ jobData.type + jobData.city  + jobData.waitTime +' '+ jobData.timeLimit);
// 				resetJob();
// 				// clearInterval(expirationTimer); // Stop the timer
// 			}
// 		}
// 		if (get(elapsed) >= FullTimeLimit) {
//             clearInterval(expirationTimer); // Stop the timer when the time is up
//         }
// 		}, 1000);
// 	});

// 	onDestroy(() => {
// 		clearInterval(expirationTimer);
// 	});

	let unsubscribeElapsed;

	onMount(() => {
	// Start the subscription to the elapsed store
		unsubscribeElapsed = elapsed.subscribe($elapsed => {
			if (countdown > 0) {
				countdown--;
				if (countdown === 0) {
					console.log('make job readddddyyyy!')
					// Update job as ready in the store
					updateJobState(jobData.id, true, false);
					curTime = get(elapsed);
					logHistory(`i:(${jobData.index}) Job ${title} now available`);
				}
			} else if (countdown == 0 && !jobData.ready) {
				console.log('make job readddddyyyy!')
				updateJobState(jobData.id, true, false);
				curTime = get(elapsed);
				logHistory(`i:(${jobData.index}) Job ${title} now available`);
			} else if (jobData.ready && !jobData.expired && get(elapsed) - curTime >= expirationTime) {
			// Update job as expired in the store
				console.log('dettteeected!')
				updateJobState(jobData.id, false, true);
				curTime = null;
				logHistory(`i:(${jobData.index}) Job ${title} has expired`);
				// generateSingleData(jobData.id);
			} 
		});
	});

	onDestroy(() => {
		unsubscribeElapsed();
	});

	function updateJobState(id, ready, expired) {
		jobs.update(allJobs => {
			const jobIndex = allJobs.findIndex(job => job.id === id);
			if (jobIndex !== -1) {
				allJobs[jobIndex] = { ...allJobs[jobIndex], ready, expired };
				if (expired) {
				// rest job
					generateSingleData(id);
				}
			}
			return allJobs;
			});
	}
	function resetJob(id) {
		updateJobState(id, false, true);
		generateSingleData(id); 
		logHistory(`i:(${jobData.index}) Job ${title} has been reset`);
	}
		
	// onMount(() => {
	// 	setInterval(() => {
	// 		countdown--;
	// 	}, 1000);
	// });

	// $: ready = countdown <= 0;
	// $: {
	// 	if (ready) {
	// 		logHistory(`i:(${jobData.index}) Job ${title} now available`);
	// 		curTime = get(elapsed);
	// 		console.log(curTime);
	// 	}
	// }
	// $: expired = $elapsed - curTime >= expirationTime;
	// $: {
	// 	if (countdown <= 0) 
	// 	if (expired) {
	// 		// ready = false;
	// 		console.log(jobData.type + jobData.city + ': expirrrrrrrrrrrrrre!!!!!');
	// 		logHistory(`i:(${jobData.index}) Job ${title} has expired`);
	// 		generateSingleData(id);
	// 	}
	// }


	function start() {
		// console.log('DEBUG:', countdown, countdown <= 0);
		if (jobData.ready) {
			// logHistory(`chose task ${title}`);
			let hardLimit = jobData.timeLimit * 2;

			if ($currLocation !== jobData.city) {
				currLocation.set('');
				// wait for 5 sec
				setTimeout(() => {
					currLocation.set(jobData.city);
				}, 5000);
				startGame(title, earnings, numSteps, timeLimit, hardLimit);
				resetJob(id)
			}
			startGame(title, earnings, numSteps, timeLimit, hardLimit);
			resetJob(id)
			
		}
	}
</script>

<div class="card">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="card-content" class:ready={jobData.ready} style="background: {color};" on:click={start}>
		<h2>{title}</h2>

		<i>
			<p>Avg Wait Time: {avgWait}</p>
			<p>Avg Earnings: ${avgEarnings}</p>
			<p>Avg Number of Items: {avgItems}</p>
		</i>

		{#if !jobData.ready}
			<br />
			<p>
				<i>Not ready</i>
				<!-- {countdown} -->
			</p>
			<!-- <h4>{countdown}</h4> -->
		{:else}
			{#if jobData.type === 'UberEats'}
				<p>There are {numSteps} items</p>
			{:else}
				<p>There are {numSteps} blocks</p>
			{/if}
			Ready!
			<!-- Expire in {expirationTime}s -->
		{/if}
			
	</div>
</div>
