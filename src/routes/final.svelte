<script>
	import { onMount } from 'svelte';
	import { logHistory, history } from '$lib/stores.js';

	onMount(() => {
		logHistory('Finished Game');
	});
</script>

<div class="container">
    <h1>You have finished the game!</h1>
	<!-- <h4>Please copy this and email to <a href="mailto:bobalab@berkeley.edu">bobalab@berkeley.edu</a>:</h4> -->
    <!-- <h4>Please copy this and email to bobalab@berkeley.edu:</h4> -->
</div>
<!-- <div class="content">
    <p>{JSON.stringify($history)}</p>
</div> -->

<style>
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 50vh; /* Set the height to 50% of the viewport height */
    }

    h1{
        font-size: 24px;
        text-align: center;
        margin: 0;
    }

    .content {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50vh; /* Set the height to 50% of the viewport height */
    }

    p {
        font-size: 4px; /* Adjust the font size as needed */
        text-align: center;
        margin: 0;
    }
</style>

