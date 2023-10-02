<script>
	import '../app.css';
	import Home from './home.svelte';
	import Game from './game.svelte';
	import { elapsed, game, earned } from '$lib/stores.js';
	import { onMount } from 'svelte';

	$: inGame = $game.inGame;
</script>

<div class="hud">
	<h3>Time: {$elapsed}</h3>
	<h3>Earned: {$earned}</h3>
</div>

{#if inGame}
	<Game />
{:else}
	<Home />
{/if}
