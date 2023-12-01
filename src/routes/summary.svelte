<script>
	import '../app.css';
	import { game, logHistory } from '$lib/stores.js';

	/* previous game */
	const prevGameState = $game;
	let job = prevGameState.title;
	let time = prevGameState.time;
	let mistake = prevGameState.mistakes;
	let earning = prevGameState.earning;
	let hardLimit = prevGameState.hardLimit;

	/* reactive ui stuff */
	const proficiencyText = ['Very Good', 'Very Bad'];
	let rating = 0;
	let isRatingSelected = false; 
	$: isRatingSelected = rating > 0;

	function returnHome() {
		logHistory("rate", rating, `Rated themselves: ${rating}`);
		$game.inSummary = false;
	}

	// function storeRating() {
		// lastEntry.rating = rating;
		// logHistory(`Changed rating: ${rating}`);
		// history.update((list) => {
		//     list[$history.length - 1] = lastEntry;
		//     return list;
		// });
	// }
</script>

<div class="page">
	{#if time == hardLimit}
		<h3>You have not completed {job} job,<br>the customer has canceled the order</h3>
	{:else}
		<h3>You have completed {job} job in {time}s</h3>
	{/if}
	<p>You made {mistake} mistakes</p>
	<p>You earned ${earning}</p>
	<h4>Rate your proficiency on this job:</h4>
	<!-- star rating -->
	<div class="rating">
		<div class="left-label">still learning</div>
			<input type="radio" name="star" class="star-5" id="star-5" bind:group={rating} value="5" />
            <label class="star" for="star-5"></label>
            <input type="radio" name="star" class="star-4" id="star-4" bind:group={rating} value="4" />
            <label class="star" for="star-4"></label>
            <input type="radio" name="star" class="star-3" id="star-3" bind:group={rating} value="3" />
            <label class="star" for="star-3"></label>
            <input type="radio" name="star" class="star-2" id="star-2" bind:group={rating} value="2" />
            <label class="star" for="star-2"></label>
            <input type="radio" name="star" class="star-1" id="star-1" bind:group={rating} value="1" />
            <label class="star" for="star-1"></label>
		<div class="right-label">proficient</div>
	</div>

	<button on:click={returnHome} disabled={!isRatingSelected}>Return</button>
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

	h4 {
		font-size: 18px;
		margin-bottom: 20px;
		margin-top: 40px;
	}

	p {
		font-size: 18px;
		margin: 5px 0;
	}

	.rating {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%; 
		max-width: 600px; 
		margin: 0 auto;
		flex-direction: row-reverse;
	}

	.star {
		font-size: 20px;
		padding: 5px;
		cursor: pointer;
	}

	input[type="radio"] {
		display: none;
	}

	.star::before {
		content: "\2605";
		color: #ccc;
	}

	input[type="radio"]:checked ~ label::before {
    	color: #f0ad4e;
	}

	.left-label{
		flex: 1; 
  		text-align: center;
		 
	}
	.right-label{
		flex: 1; 
  		text-align: center; 
	}

</style>
