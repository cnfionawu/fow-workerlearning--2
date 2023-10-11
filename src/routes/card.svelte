<script>
	import { onMount } from 'svelte';
	import { startGame, logHistory, randomPick, UpdateJobs } from '$lib/stores.js';
	import {data} from '../data/data.js';

	export let title;
	export let color;
	export let waitTime;
	export let earnings;

	const index = data.map(list => randomPick(list));
	const jobs = UpdateJobs(index);
	console.log(jobs);

	let countdown = waitTime;
	let numSteps;
	let hardLimit;

	onMount(() => {
		setInterval(() => {
			countdown--;
		}, 1000);
	});

	$: ready = countdown <= 0;

	function start() {
		if (ready) {
			const job = jobs.find(job => job.title === title);
			console.log(job);
			const timeLimit = job.timeLimit;
			console.log(timeLimit);
			earnings = job.earning;
			numSteps = job.numSteps;
			hardLimit = job.hardLimit;
			logHistory(`chose task ${title}`);
			startGame(title, earnings, numSteps, timeLimit, hardLimit);
		}
	}
</script>

<div class="card">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="card-content" class:ready style="background: {color};" on:click={start}>
		<h2>{title}</h2>

		<!-- <p>Wait Time: {waitTime}s</p>
		<p>Earnings: ${earnings}</p> -->
		{#if title.includes('Berkeley')}
			<p>Avg Wait Time: 15s</p>
		{:else}
			<p>Avg Wait Time: 20s</p>
		{/if}

		{#if title.includes('UberEats')}
			<p>Avg Earnings: $40</p>
		{:else}
			<p>Avg Earnings: $20</p>
		
		{/if}
		

		{#if !ready}
			<br />
			<h4>{countdown}</h4>
		{:else}
			{#if title.includes('UberEats')}
				<p>There are {numSteps} items</p>
			{:else}
				<p>There are {numSteps} blocks</p>
			{/if}
			Ready!
		{/if}
	</div>
</div>
