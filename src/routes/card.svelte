<script>
	import { onMount } from 'svelte';
	import { startGame, logHistory } from '$lib/stores.js';

	const SECONDS_PER_JOB = 4;

	// export let title;
	// export let waitTime;
	// export let earnings;
	export let jobData;
	export let color;

	const title = `${jobData.type} - ${jobData.city}`;
	let countdown = jobData.waitTime;
	let numSteps = Math.floor(jobData.timeLimit / SECONDS_PER_JOB);
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

			/* Shunan's number / 2 = soft deadline, Hard deadline = 2 x soft deadline */
			startGame(title, earnings, numSteps, Math.round(jobData.timeLimit / 2), jobData.timeLimit);
		}
	}
</script>

<div class="card">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="card-content" class:ready style="background: {color};" on:click={start}>
		<h2>{title}</h2>

		<p>Wait Time: {jobData.waitTime}s</p>
		<p>Earnings: ${earnings}</p>

		{#if !ready}
			<br />
			<p>
				<i>Not ready</i>
				{countdown}
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
