<script>
	import '../app.css';
	import Home from './home.svelte';
	import Game from './game.svelte';
	import Summary from './summary.svelte';
	import Final from './final.svelte'
	import { elapsed, game, earned, history } from '$lib/stores.js';

	const timeLimit = 30;

	$: inGame = $game.inGame;
	$: timeUp = $elapsed > timeLimit;
	$: inSummary = $game.inSummary;
</script>


{#if inGame}
	<div class="hud">
		<h3 class:err={timeUp}>Time limit: {timeLimit}</h3>
		<h3>Time: {$elapsed}</h3>
		<h3>Earned: {$earned}</h3>
	</div>
	<Game />
{:else if inSummary}
	<div class="hud">
		<h3 class:err={timeUp}>Time limit: {timeLimit}</h3>
		<h3>Time: {$elapsed}</h3>
		<h3>Earned: {$earned}</h3>
	</div>
	<Summary />
{:else if timeUp}
	<Final />
{:else}
	<div class="hud">
		<h3 class:err={timeUp}>Time limit: {timeLimit}</h3>
		<h3>Time: {$elapsed}</h3>
		<h3>Earned: {$earned}</h3>
	</div>
	<Home />
	
{/if}

<div>
	<i>history:</i>
	[{$history}]
</div>
