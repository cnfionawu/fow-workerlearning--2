<script>
	import '../app.css';
	import Home from './home.svelte';
	import Game from './game.svelte';
	import Summary from './summary.svelte';
	import Final from './final.svelte';
	import {
		elapsed,
		game,
		earned,
		history,
		logHistory,
		resetTimer,
		currLocation
	} from '$lib/stores.js';

	const timeLimit = 1200;

	$: inGame = $game.inGame;
	$: timeUp = $elapsed > timeLimit;
	$: inSummary = $game.inSummary;

	let started = false;
	let userName = '';
	function initializeGame() {
		started = true;
		resetTimer();
		logHistory(`${userName} started a game with ${timeLimit} timeLimit`);
	}

	$: {
		if (timeUp) {
			const gameArrToSend = JSON.stringify($history);
			console.log('Sending experiment result:', gameArrToSend);
			console.log('Type of experiment result:', typeof gameArrToSend);
			window.parent.postMessage({ type: 'gameArr', data: gameArrToSend }, '*');
		}
	}
</script>

{#if !timeUp && started}
	<div class="hud">
		<h3 class:err={timeUp}>Time limit: {timeLimit}</h3>
		<p><b>Time</b>: {$elapsed}s</p>
		<p><b>Earned</b>: ${$earned}</p>
		<p><b>Location</b>: {$currLocation}</p>
		<p><i>Takes 5 seconds to go to {$currLocation === 'SF' ? 'Berkeley' : 'SF'}</i></p>
	</div>
{/if}

{#if !started}
	<div class="page">
		<div class="game">
			<p>Enter your name:</p>
			<input bind:value={userName} type="text" />
			<button on:click={initializeGame}>Start</button>
		</div>
	</div>
{:else if inGame && $currLocation !== ''}
	<Game />
{:else if inSummary}
	<Summary />
{:else if timeUp}
	<Final />
{:else}
	<Home />
{/if}

{#if $currLocation === ''}
<div class="traveling">Travling ...</div>
{/if}

<!-- <div>
	<i>history:</i>
	{JSON.stringify($history)}
</div> -->
<style>
	.traveling {
		position: fixed;
		height: 100vh;
		width: 100vw;
		z-index: 1;
		text-align: center;
		/* z-index: 99999999999999999 !important; */
		background-color: rgba(128, 128, 128, 0.519);
	}
</style>
