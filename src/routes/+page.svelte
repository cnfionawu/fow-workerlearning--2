<script>
	import '../app.css';
	import Home from './home.svelte';
	import Game from './game.svelte';
	import Summary from './summary.svelte';
	import Final from './final.svelte';
	import Choices from './choice.svelte';
	import Leisure from './leisure.svelte';
	import {
		elapsed,
		game,
		earned,
		logHistory,
		resetTimer,
		currLocation,
		FullTimeLimit,
		LeisureTime,
		changeLocation
	} from '$lib/stores.js';

	$: inGame = $game.inGame;
	$: timeUp = $elapsed > FullTimeLimit;
	$: inSummary = $game.inSummary;
	$: inChoices = $game.inChoices
	$: inLeisure = $game.inLeisure;
	

	let started = false;
	let userName = '';

	function initializeGame() {
		started = true;
		resetTimer();
		logHistory("start game", userName, `${userName} started a game with ${FullTimeLimit} timeLimit`);
	}

	function goToLeisureOrWork() {
		$game.inChoices = true;
	}

</script>

<!-- info shared on all pages -->
{#if !timeUp && started}
	<div class="hud">
		<h3 class:err={timeUp}>Time limit: {FullTimeLimit}</h3>
		<p><b>Time</b>: {$elapsed}s</p>
		<p><b>Leisure Time</b>: {$LeisureTime}s</p>
		<p><b>Earned</b>: ${$earned}</p>
		<p><b>Location</b>: {$currLocation}</p>
		<p><i>Takes 5 seconds to go to {$currLocation === 'SF' ? 'Berkeley' : 'SF'}</i></p>
	</div>
{/if}

<!-- render different pages -->
{#if !started}
	<div class="page">
		<div class="game">
			<p>Enter your name:</p>
			<input bind:value={userName} type="text" />
			<button on:click={() => { initializeGame(); goToLeisureOrWork(); }}>Start</button>
		</div>
	</div>
{:else if inChoices}
	<Choices />
{:else if inLeisure}
	<Leisure />
{:else if inGame && $currLocation !== ''}
	<Game />
{:else if inSummary}
	<Summary />
{:else if timeUp}
	<Final />
{:else}
	<Home />
{/if}

{#if $changeLocation === true}
	<div class="traveling">Traveling ...</div>
{/if}

<!-- debug -->
<div>
	<!-- <i class="debug">history:</i> -->
	<!-- {JSON.stringify($history)} -->
	<!-- <p>uploaded: {$print}</p> -->
</div>


<style>
	.traveling {
		position: fixed;
		top: 0;
    	left: 0;
		height: 100vh;
		width: 100vw;
		z-index: 1000;
		text-align: center;
		font-size: 30px;
		/* z-index: 99999999999999999 !important; */
		background-color: rgba(128, 128, 128, 0.519);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.debug {
		margin-top: 100px;
	}
</style>
