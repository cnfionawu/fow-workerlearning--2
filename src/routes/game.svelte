<script>
	import { game, endGame, logHistory } from '$lib/stores.js';
	import { onMount, setContext } from 'svelte';

	/* GAME STATE */
	let timePassed = 0.0;
	let stepsLeft = $game.numSteps;
	let timeLimit = $game.timeLimit;
	let job = $game.title;
	let hardLimit = $game.hardLimit;

	/* WORD LIST */
	const wordBank = $game.isUberEats
		? ['apple', 'coconut', 'banana', 'pineapple']
		: ['red', 'green', 'yellow'];
	let currentWord = wordBank[stepsLeft % wordBank.length];
	let mistakes = 0;

	/* User Input (reactive ui elem) */
	let userInput = '';
	let status = 'type!';

	function round(value, decimals) {
		return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
	}

	/* Start Timer */
	onMount(() => {
		logHistory(
			`Task ${job} was started with: ${stepsLeft} steps, ${timeLimit} timeLimit, ${hardLimit} hardLimit`
		);
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
			logHistory(`(${stepsLeft}) Correct Guess: ${currentWord}`);
			status = 'Correct!';
			userInput = '';
			stepsLeft--;
			if (stepsLeft > 0) {
				currentWord = wordBank[stepsLeft % wordBank.length];
			}
		} else {
			logHistory(`(${stepsLeft}) Incorrect Guess: ${currentWord}, mistyped ${userAnswer}`);
			status = 'Incorrect. Try again.';
			mistakes++;
		}
	}

	function handleKeyUp(event) {
		if (event.key === 'Enter') {
			checkGuess();
		}
	}

	// const lastEntry = $history[$history.length - 1];

	function finish() {
		const penalty = timePassed > timeLimit ? Math.min(timePassed - timeLimit, $game.earnings) : 0;
		// const penalty = 0;
		const earned = $game.earnings - penalty;
		logHistory(
			`Ended with: ${mistakes} mistakes, ${earned} earned, ${timePassed} in game time passed`
		);

		const gameState = {};

		gameState.title = job;
		gameState.status = 'finished';
		gameState.mistakes = mistakes;
		gameState.earning = $game.earnings - penalty;
		gameState.time = timePassed;
		gameState.hardLimit = hardLimit;

		// history.update((list) => {
		// // 	list.push({
		// //     status: 'finished',
		// //     mistakes: mistakes,
		// // 	earning: $game.earnings - penalty,
		// //     time: timePassed,
		// // });
		// 	list[$history.length - 1] = lastEntry;
		// 	return list;
		// });
		// const penalty = timePassed > timeLimit ? Math.min(timePassed - timeLimit, $game.earnings) : 0;
		// endGame($game.earnings - penalty);
		endGame(earned, gameState);
	}

	$: {
		if (stepsLeft <= 0) {
			finish();
		}

		if (timePassed >= hardLimit) {
			finish();
		}
	}
</script>

<div class="page">
	<div class="game">
		<h3>{job}</h3>
		<h3 class:err={timePassed > timeLimit}>
			Timer: {timeLimit - timePassed} (Debug time taken: {timePassed})
		</h3>
		<p>Left: {stepsLeft}</p>

		<img id="input-img" src="./images/{currentWord}.jpg" alt="img" />
		<input bind:value={userInput} type="text" placeholder="Input" on:keyup={handleKeyUp} />

		<div class="status">{status}</div>
	</div>
</div>

<style>
	img {
		display: block;
		margin: auto;
		height: 250px;
	}
</style>
