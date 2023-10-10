<script>
	import '../app.css';
	import Home from './home.svelte';
	import Game from './game.svelte';
	import Summary from './summary.svelte';
	import Final from './final.svelte';
	import { elapsed, game, earned, history, logHistory, resetTimer } from '$lib/stores.js';

	const timeLimit = 15;

	$: inGame = $game.inGame;
	$: timeUp = $elapsed > timeLimit;
	$: inSummary = $game.inSummary;

	let started = false;
	let userName = '';
	function initializeGame() {
		started = true;
		resetTimer();
		logHistory(`${userName} started a game`);
	}

	$: {
        if (timeUp) {
            const gameArrToSend = JSON.stringify($history);
            console.log("Sending experiment result:", gameArrToSend);
            console.log("Type of experiment result:", typeof gameArrToSend);
            window.parent.postMessage({ type: 'gameArr', data: gameArrToSend }, '*');
        }
    }
</script>

{#if !timeUp && started}
	<div class="hud">
		<h3 class:err={timeUp}>Time limit: {timeLimit}</h3>
		<h3>Time: {$elapsed}</h3>
		<h3>Earned: {$earned}</h3>
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
{:else if inGame}
	<Game />
{:else if inSummary}
	<Summary />
{:else if timeUp}
	<Final />
{:else}
	<Home />
{/if}

<div>
	<i>history:</i>
	
	{JSON.stringify($history)}
</div>
