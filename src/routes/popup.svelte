<!-- Leisure popup notice page -->
<script>
    import { onMount, onDestroy } from 'svelte';
    import { get } from 'svelte/store';
    import {
		game,
		earned,
		logHistory,
        LeisureTime,
        leisurePay,
        confirmedToStay,
        leisureStart
	} from '$lib/stores.js';

    let timer;
    let earning;
    export let closePopup; 

// Check user confirm to stay or leave leisure or no response
    const confirmStay = () => {
        confirmedToStay.set(true);
        clearTimeout(timer);
        closePopup();
        logHistory("confirm stay in leisure", null, 'Confirm to stay in leisure');
    };
  
    const cancelStay = () => {
        $game.inChoices = true;
        confirmedToStay.set(false);
        const inLeisureTime = get(LeisureTime) - get(leisureStart);
        earning = parseFloat((inLeisureTime * leisurePay).toFixed(2));
        earned.update((n) => {
            const updatedValue = parseFloat((n + earning).toFixed(2));
            return updatedValue;
        });
        clearInterval(timer);
        logHistory("confirm leave leisure", [inLeisureTime, earning], 'Confirm to leave leisure, stayed for ' + inLeisureTime + 's, earned $' + earning);

    };

    const noResponse = () => {
        $game.inChoices = true;
        confirmedToStay.set(false);
        const inLeisureTime = get(LeisureTime) - get(leisureStart);
        earning = parseFloat((inLeisureTime * leisurePay).toFixed(2));
        earned.update((n) => {
            const updatedValue = parseFloat((n + earning).toFixed(2));
            return updatedValue;
        });
        logHistory("didn't choose", [inLeisureTime, earning], 'Did not choose in 5s, forced to leave leisure, stayed for ' + inLeisureTime + 's, earned $' + earning);

    };

    onMount(() => {
        timer = setTimeout(noResponse, 5000); // set a timer to trigger cancelStay after 5 seconds
    });
    
</script>
  
<div>
    <p>Are you still there? Click YES within 5 seconds to stay in leisure.</p>
    <button on:click={confirmStay}>YES</button>
    <button on:click={cancelStay}>NO</button>
</div>

<style>
    div {
      z-index: 10000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: #f8d7da;
      padding: 20px;
      width: 300px;
    }
  
    p {
      font-size: 16px;
      color: #721c24;
      margin-bottom: 15px;
      text-align: center;
    }
  
    button {
      padding: 10px;
      font-size: 16px;
      margin-right: 10px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  
</style>
  