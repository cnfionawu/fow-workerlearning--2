<script>
	import Card from './card.svelte';
</script>

<div class="choices">
	<Card title="Uber (Berkeley)" waitTime={3} earnings={23} color="#ecb98d" />
	<Card title="UberEats (Berkeley)" waitTime={1} earnings={23} color="#eea7cf" />
	<Card title="Uber (SF)" waitTime={0} earnings={23} color="#96f0c8" />
	<Card title="UberEats (SF)" waitTime={30} earnings={23} color="#89bbed" />
</div>


<!-- 
	prepop:
		* actual waitime 
		* exp completion time
		* task list based on how many stops/items 
		* how much pay
	

 -->