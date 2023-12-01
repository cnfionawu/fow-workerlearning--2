<script>
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { startGame, logHistory, elapsed, generateSingleData, jobs } from '$lib/stores.js';

	// time duration of each task
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
	let unsubscribeElapsed;

	onMount(() => {
	// Start the subscription to the elapsed store
		unsubscribeElapsed = elapsed.subscribe($elapsed => {
			if (countdown > 0) {
				countdown--;
				if (countdown === 0) {
					// Update job as ready in the store
					updateJobState(jobData.id, true, false);
					curTime = get(elapsed);
					logHistory("job available", [jobData.index, title], `i:(${jobData.index}) Job ${title} now available`);
				}
			} else if (countdown == 0 && !jobData.ready) {
				updateJobState(jobData.id, true, false);
				curTime = get(elapsed);
				logHistory("job available", [jobData.index, title], `i:(${jobData.index}) Job ${title} now available`);
			} else if (jobData.ready && !jobData.expired && get(elapsed) - curTime >= expirationTime) {
			// Update job as expired in the store
				updateJobState(jobData.id, false, true);
				curTime = null;
				logHistory("job expire", [jobData.index, title], `i:(${jobData.index}) Job ${title} has expired`);
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
	// regenerate new data for picked job
	function resetJob(id) {
		updateJobState(id, false, true);
		generateSingleData(id); 
	}

	function start() {
		// console.log('DEBUG:', countdown, countdown <= 0);
		if (jobData.ready) {
			let hardLimit = jobData.timeLimit * 2;
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
