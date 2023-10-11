<script>
	import Card from './card.svelte';
	import { onMount } from 'svelte';
	import { logHistory } from '$lib/stores.js';

	let job1 = {
		type: 'Uber',
		city: 'Berkeley',
		waitTime: 13,
		timeLimit: 38
	};
	let job2 = {
		type: 'UberEats',
		city: 'Berkeley',
		waitTime: 2,
		timeLimit: 42
	};
	let job3 = {
		type: 'UberEats',
		city: 'SF',
		waitTime: 2,
		timeLimit: 42
	};
	let job4 = {
		type: 'UberEats',
		city: 'SF',
		waitTime: 2,
		timeLimit: 42
	};

	onMount(() => {
		logHistory(`Entered home screen, displayed jobs: ${JSON.stringify([job1, job2, job3, job4])}`);
	});
</script>

<div class="choices">
	<Card jobData={job1} color="#ecb98d" />
	<Card jobData={job2} color="#eea7cf" />
	<Card jobData={job3} color="#96f0c8" />
	<Card jobData={job4} color="#89bbed" />
	<!-- <Card title="Uber (Berkeley)" waitTime={3} earnings={23} color="#ecb98d" />
	<Card title="UberEats (Berkeley)" waitTime={1} earnings={23} color="#eea7cf" />
	<Card title="Uber (SF)" waitTime={0} earnings={23} color="#96f0c8" />
	<Card title="UberEats (SF)" waitTime={30} earnings={23} color="#89bbed" /> -->
</div>

<!-- 
	prepop:
		* actual waitime 
		* exp completion time
		* task list based on how many stops/items 
		* how much pay
	

 -->
