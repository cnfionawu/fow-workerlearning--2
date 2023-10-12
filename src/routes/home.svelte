<script>
	import Card from './card.svelte';
	import { onMount } from 'svelte';
	import { logHistory } from '$lib/stores.js';
	import { data } from '$lib/data.js';

	// adjust correspondance to data's job, store
	let jobs = [
		{
			waitTime: null,
			timeLimit: null,
			type: 'UberEats',
			city: 'SF',
			index: null,
			avgWait: 15,
			avgEarnings: 40,
			avgItems: 13
		},
		{
			waitTime: null,
			timeLimit: null,
			type: 'Uber',
			city: 'SF',
			index: null,
			avgWait: 5,
			avgEarnings: 20,
			avgItems: 10
		},
		{
			waitTime: null,
			timeLimit: null,
			type: 'UberEats',
			city: 'Berkeley',
			index: null,
			avgWait: 20,
			avgEarnings: 40,
			avgItems: 13
		},
		{
			waitTime: null,
			timeLimit: null,
			type: 'Uber',
			city: 'Berkeley',
			index: null,
			avgWait: 10,
			avgEarnings: 20,
			avgItems: 10
		}
	];

	function generateData() {
		for (let i = 0; i < 4; i++) {
			const index = Math.floor(Math.random() * data[i].length);
			const random_dataPt = data[i][index]; // format: [waitTime, timeLimit]
			jobs[i].waitTime = random_dataPt[0];
			jobs[i].timeLimit = random_dataPt[1];
			jobs[i].index = [i, index];
			// console.log(jobs[i].index);
		}
	}

	generateData();

	onMount(() => {
		const jobStrings = jobs.map(
			(job) =>
				`i:(${job.index}) ${job.type} - ${job.city}: ${job.waitTime} waitTime, ${job.timeLimit} timeLimit`
		);
		logHistory(`Entered home screen, displayed jobs: ${JSON.stringify(jobStrings)}`);
		generateData();
	});
</script>

<div class="choices">
	<Card jobData={jobs[3]} color="#ecb98d" />
	<Card jobData={jobs[2]} color="#eea7cf" />
	<Card jobData={jobs[1]} color="#96f0c8" />
	<Card jobData={jobs[0]} color="#89bbed" />
</div>
