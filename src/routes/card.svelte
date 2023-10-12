<script>
	import { onMount } from 'svelte';
	import { startGame, logHistory, currLocation } from '$lib/stores.js';

	const SECONDS_PER_JOB_UBER = 2;
	const SECONDS_PER_JOB_UBEREats = 3;

	// export let title;
	// export let waitTime;
	// export let earnings;
	export let jobData;
	export let color;

	const title = `${jobData.type} - ${jobData.city}`;
	let countdown = jobData.waitTime;
	let numSteps = jobData.timeLimit;
	let avgWait = jobData.avgWait;
	let avgEarnings = jobData.avgEarnings;
	let avgItems = jobData.avgItems;
	let timeLimit = jobData.timeLimit;

	if (jobData.type == 'UberEats') {
			numSteps = Math.floor(numSteps / SECONDS_PER_JOB_UBEREats);
	} else {
		console.log(numSteps);
		numSteps = Math.floor(numSteps / SECONDS_PER_JOB_UBER);
		console.log(numSteps);
	}
	
	// let numSteps = Math.floor(jobData.timeLimit / SECONDS_PER_JOB);
	let earnings = jobData.timeLimit;

	onMount(() => {
		setInterval(() => {
			countdown--;
		}, 1000);
	});

	$: ready = countdown <= 0;
	$: {
		if (ready) {
			logHistory(`i:(${jobData.index}) Job ${title} now avaliable`);
		}
	}

	function start() {
		// console.log('DEBUG:', countdown, countdown <= 0);
		if (ready) {
			// logHistory(`chose task ${title}`);
			let hardLimit = jobData.timeLimit * 2;

			if ($currLocation !== jobData.city) {
				currLocation.set('');
				// wait for 5 sec
				setTimeout(() => {
					currLocation.set(jobData.city);
				}, 5000);
				startGame(title, earnings, numSteps, timeLimit, hardLimit);
			}
			startGame(title, earnings, numSteps, timeLimit, hardLimit);
		}
	}
</script>

<div class="card">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="card-content" class:ready style="background: {color};" on:click={start}>
		<h2>{title}</h2>

		<!-- <p>Wait Time: {jobData.waitTime}s</p>
		<p>Earnings: ${earnings}</p> -->
		<!-- only show avg wait time and earning -->

		<i>
			<p>Avg Wait Time: {avgWait}</p>
			<p>Avg Earnings: ${avgEarnings}</p>
			<p>Avg Number of Items: {avgItems}</p>
		</i>

		{#if !ready}
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
		{/if}
	</div>
</div>
