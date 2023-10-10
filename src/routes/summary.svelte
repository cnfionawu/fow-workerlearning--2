<script>
    import '../app.css';
    import {history, game} from '$lib/stores.js';
    function returnHome() {
        $game.inSummary = false;
    }

    const lastEntry = $history[$history.length - 1];

    let job = $game.title;
    let time = lastEntry.time;
    let mistake = lastEntry.mistakes;
    let earning = lastEntry.earning;
</script>


<div class="page">

    <!-- {#if {completed}}
    {:else}
    {/if} -->
	<h3>You have completed {job} job in {time}s</h3>
	<p>You made {mistake} mistakes</p>
    <p>Your earning for this job is ${earning}</p>
		
	<button on:click={returnHome}>Return</button>
		

</div>

<style>
    .page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
    font-family: Arial, sans-serif; 
    background-color: #f0f0f0; 
    padding: 20px; 
}

    h3 {
        font-size: 24px; 
        margin-bottom: 10px; 
    }

    p {
        font-size: 18px; 
        margin: 5px 0; 
    }

    button {
        padding: 10px 20px; 
        background-color: #007bff; 
        color: #fff; 
        border: none;
        border-radius: 5px; 
        cursor: pointer;
        font-size: 16px; 
    }

    button:hover {
        background-color: #0056b3; 
    }

</style>