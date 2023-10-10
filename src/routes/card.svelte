<script>
	import { onMount } from 'svelte';
	import { history, startGame } from '$lib/stores.js';

	export let title;
	export let color;
	export let waitTime;
	export let earnings;

	let countdown = waitTime;
	let numSteps = 5;
	let hardLimit = 10;

	onMount(() => {
		setInterval(() => {
			countdown--;
		}, 1000);
	});

	$: ready = countdown <= 0;

	function start() {
		if (ready) {
			history.update((list) => {
				// list.push('start: ' + title);
				list.push({ status: 'start', title: title });
				return list;
			});

			// numSteps = 5;
			const timeLimit = 5;
			startGame(title, earnings, numSteps, timeLimit, hardLimit);
			console.log($history);
		}
	}
</script>

<div class="card">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="card-content" class:ready style="background: {color};" on:click={start}>
		<h2>{title}</h2>

		<p>Wait Time: {waitTime}s</p>
		<p>Earnings: ${earnings}</p>

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
