<script>
	import { onMount } from 'svelte';
	import { logHistory } from '$lib/stores.js';

	onMount(() => {
		logHistory('Finished Game');
	});
</script>

<div>
	<h1>You have finished the game!</h1>
</div>

<style>
	div {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh; /* Set the height to 100% of the viewport height */
	}

	h1 {
		font-size: 24px; /* Adjust the font size as needed */
		text-align: center; /* Center the text horizontally */
		margin: 0; /* Remove any default margin */
	}
</style>
