<script>
    import { onMount, onDestroy } from 'svelte';
    import { get } from 'svelte/store';
    import {
		elapsed,
		game,
		earned,
		history,
		logHistory,
        LeisureTime,
        leisurePay,
        confirmedToStay
	} from '$lib/stores.js';

    let confirmation = false;
    let timer;
    let stayTime;
    let earning;

    const confirmStay = () => {
      confirmation = true;
      confirmedToStay.set(true);
      clearTimeout(timer);
      logHistory('Confirm to stay in leisure');
    };
  
    const cancelStay = () => {
        $game.inChoices = true;
        confirmation = false;
        confirmedToStay.set(false);
        earning = parseFloat((get(LeisureTime) * leisurePay).toFixed(2));
        earned.update((n) => {
            const updatedValue = parseFloat((n + earning).toFixed(2));
            return updatedValue;
        });
        clearInterval(timer);
        logHistory('Confirm to leave leisure, stayed for ' + get(LeisureTime) + 's, earned $' + earning);

    };

    const noResponse = () => {
        $game.inChoices = true;
        confirmation = false;
        confirmedToStay.set(false);
        earning = parseFloat((get(LeisureTime) * leisurePay).toFixed(2));
        earned.update((n) => {
            const updatedValue = parseFloat((n + earning).toFixed(2));
            return updatedValue;
        });
        logHistory('Did not choose in 5s, forced to leave leisure, stayed for ' + get(LeisureTime) + 's, earned $' + earning);

    };

    onMount(() => {
        timer = setTimeout(noResponse, 5000); // set a timer to trigger cancelStay after 5 seconds
    });
</script>
  
<div>
    {#if !confirmation}
        <div>
        <p>Are you still there? Click YES within 5 seconds to stay in leisure.</p>
        <button on:click={confirmStay}>YES</button>
        <button on:click={cancelStay}>NO</button>
        </div>
    {:else}
        <p>Enjoy your leisure time!</p>
    {/if}
</div>

<style>
    div {
      z-index: 1000;
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
  