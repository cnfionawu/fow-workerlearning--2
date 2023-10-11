<script>
	import { onMount } from 'svelte';
	import { startGame, logHistory } from '$lib/stores.js';

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
	if (jobData.type == 'UberEats') {
		numSteps = Math.floor(numSteps/SECONDS_PER_JOB_UBEREats);
	} else {
		numSteps = Math.floor(numSteps/SECONDS_PER_JOB_UBER);
	}
	// let numSteps = Math.floor(jobData.timeLimit / SECONDS_PER_JOB);
	let earnings = jobData.timeLimit / 2;

	onMount(() => {
		setInterval(() => {
			countdown--;
		}, 1000);
	});

	$: ready = countdown <= 0;

	function start() {
		if (ready) {
			// logHistory(`chose task ${title}`);
			let hardLimit = jobData.timeLimit * 2;
			startGame(title, earnings, numSteps, jobData.timeLimit, hardLimit);
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
		{#if title.includes('Berkeley')}
			<p>Avg Wait Time: 15s</p>
		{:else}
			<p>Avg Wait Time: 20s</p>
		{/if}

		{#if title.includes('UberEats')}
			<p>Avg Earnings: $40</p>
			<p>Avg Number of Items: 13</p>
		{:else}
			<p>Avg Earnings: $20</p>
			<p>Avg Number of Items: 10</p>

		{/if}

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
