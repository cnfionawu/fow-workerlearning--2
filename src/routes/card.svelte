<script>
	import { onMount } from 'svelte';
	import { history, startGame } from '$lib/stores.js';

	export let title;
	export let color;
	export let waitTime;
	export let earnings;

	let countdown = waitTime;

	onMount(() => {
		setInterval(() => {
			countdown--;
		}, 1000);
	});

	$: ready = countdown <= 0;

	function handleClick() {
		if (ready) {
			history.update((list) => {
				list.push('start: ' + title);
				return list;
			});
			console.log($history);
			startGame();
		}
	}
</script>

<div class="card">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="card-content" class:ready style="background: {color};" on:click={handleClick}>
		<h2>{title}</h2>

		{#if !ready}
			<h4>{countdown}</h4>
		{:else}
			Ready
		{/if}

		<p>Wait Time: {waitTime}s</p>
		<p>Earnings: ${earnings}</p>
	</div>
</div>
