<script>
	import { history, game, endGame } from '$lib/stores.js';
	import { onMount } from 'svelte';

	let timePassed = 0;
	let stepsLeft = $game.numSteps;
	let timeLimit = $game.timeLimit;

	const wordBank = $game.isUberEats
		? ['apple', 'coconut', 'banana', 'pineapple']
		: ['red', 'green', 'yellow'];
	let currentWord = 'apple';
	let mistakes = 0;

	let userInput = '';
	let status = 'type!';

	onMount(() => {
		setInterval(() => {
			if (stepsLeft > 0) {
				timePassed++;
			}
		}, 1000);
	});

	function checkGuess() {
		if (stepsLeft <= 0) return;
		const userAnswer = userInput.toLowerCase();

		if (userAnswer === currentWord) {
			status = 'Correct!';
			userInput = '';
			stepsLeft--;
			if (stepsLeft > 0) {
				currentWord = wordBank[stepsLeft % 4];
			}
		} else {
			status = 'Incorrect. Try again.';
			mistakes++;
		}
	}

	function handleKeyUp(event) {
		if (event.key === 'Enter') {
			checkGuess();
		}
	}

	function finish() {
		console.log($history);
		history.update((list) => {
			list.push(`finished: ${mistakes} mistakes in ${timePassed} s`);
			return list;
		});
		const penalty = timePassed > timeLimit ? Math.min(timePassed - timeLimit, $game.earnings) : 0;
		endGame($game.earnings - penalty);
	}
</script>

<div class="page">
	<div class="game">
		<h3 class:err={timePassed > timeLimit}>
			Timer: {timeLimit - timePassed} (Debug time taken: {timePassed})
		</h3>
		<p>Left: {stepsLeft}</p>

		<img id="input-img" src="./images/{currentWord}.jpg" alt="img" />
		<input bind:value={userInput} type="text" placeholder="Input" on:keyup={handleKeyUp} />

		<div class="status">{status}</div>

		{#if stepsLeft <= 0}
			<button on:click={finish}>Return</button>
		{/if}
	</div>
</div>

<style>
	.page {
		height: 100vh;
		width: 100vw;
		display: flex;
		justify-content: center;
	}

	.game {
		margin: auto;
		height: 50vh;
		width: 50vw;
		text-align: center;
	}

	.status {
		color: grey;
	}

	img {
		display: block;
		margin: auto;
		width: 250px;
	}

	input {
		width: 200px;
		padding: 10px;
		margin: 10px auto;
	}

	button {
		all: unset;
		color: white;
		background: grey;
		padding: 6px 12px;
		cursor: pointer;
	}
</style>
