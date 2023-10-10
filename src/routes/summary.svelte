<script>
	import '../app.css';
	import { history, game, logHistory } from '$lib/stores.js';
    import { getContext } from 'svelte';

	// console.log($game);

    /* previous game */
	// const prevGameState = $history[$history.length - 1];
	const prevGameState = $game;
	let job = prevGameState.title;
	let time = prevGameState.time;
	let mistake = prevGameState.mistakes;
	let earning = prevGameState.earning;
	let hardLimit = prevGameState.hardLimit;

    /* reactive ui stuff */
	const proficiencyText = ['Good', 'Bad'];
	let rating = 0.5;

	function returnHome() {
		logHistory(`Rated themselves: ${rating}`);
		$game.inSummary = false;
	}

	function storeRating() {
		// lastEntry.rating = rating;
		logHistory(`Changed rating: ${rating}`);
		// history.update((list) => {
		//     list[$history.length - 1] = lastEntry;
		//     return list;
		// });
	}
</script>

<div class="page">
	{#if time == hardLimit}
		<h3>You have not completed {job} job, the customer has canceled the order</h3>
	{:else}
		<h3>You have completed {job} job in {time}s</h3>
	{/if}
	<p>You made {mistake} mistakes</p>
	<p>You earned ${earning}</p>

	<!-- slider -->
	<h4>Rate your proficiency on this job:</h4>
	<div class="slider-container">
		<div class="slider-label">{proficiencyText[0]}</div>
		<input
			type="range"
			min="0"
			max="1"
			step="0.1"
			class="slider"
			bind:value={rating}
			on:input={storeRating}
		/>
		<div class="slider-label">{proficiencyText[1]}</div>
	</div>

	<button on:click={returnHome}>Return</button>
</div>

<style>
	.page {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
		text-align: center;
		font-family: Arial, sans-serif;
		background-color: #f0f0f0;
		padding: 20px;
	}

	h3 {
		font-size: 24px;
		margin-bottom: 10px;
	}

	h4 {
		font-size: 18px;
		margin-bottom: 20px;
		margin-top: 40px;
	}

	p {
		font-size: 18px;
		margin: 5px 0;
	}

	.slider-container {
		display: flex;
		align-items: center;
	}

	.slider {
		width: 200px;
		margin: 0 10px;
	}

	.slider-label {
		font-size: 16px;
	}
</style>
