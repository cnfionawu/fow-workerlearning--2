<script>
	import '../app.css';
	import Home from './home.svelte';
	import Game from './game.svelte';
	import { elapsed, game, earned, history } from '$lib/stores.js';

	const timeLimit = 240;

	$: inGame = $game.inGame;
	$: timeUp = $elapsed > timeLimit;
</script>

<div class="hud">
	<h3 class:err={timeUp}>Time limit: {timeLimit}</h3>
	<h3>Time: {$elapsed}</h3>
	<h3>Earned: {$earned}</h3>
</div>

{#if inGame}
	<Game />
{:else}
	<Home />
{/if}

<div>
	<i>history:</i>
	[{$history}]
</div>
