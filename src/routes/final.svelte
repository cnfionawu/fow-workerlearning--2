<script>
	import { onMount } from 'svelte';
    import { get } from 'svelte/store';
	import { logHistory, GameOver, earned } from '$lib/stores.js';

    // check if game is over
	onMount(() => {
		logHistory("finish game", get(earned), 'Finished Game, total earning is $' + get(earned));
        GameOver.set(true);
	});
</script>

<div class="container">
    <h1>You have finished the game!</h1>
	<!-- <h4>Please copy this and email to <a href="mailto:bobalab@berkeley.edu">bobalab@berkeley.edu</a>:</h4> -->
    <!-- <h4>Please copy this and email to bobalab@berkeley.edu:</h4> -->
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 50vh;
    }

    h1{
        font-size: 24px;
        text-align: center;
        margin: 0;
    }
</style>

