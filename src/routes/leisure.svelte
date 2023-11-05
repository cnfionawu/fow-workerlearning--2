<script>
    import { onMount, onDestroy } from "svelte";
    import { get } from 'svelte/store';
    import Popup from "./popup.svelte";
    import { confirmedToStay, elapsed, leisurePay, LeisureTime } from '$lib/stores.js';
    
    let showPopup = false;
    let interval;
    let leisureinterval;
    LeisureTime.set(0.0);
    let formattedTimePassed = '00:00:00'; 

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };
    $: formattedTimePassed = formatTime($LeisureTime);
    
    const handlePopup = () => {
        confirmedToStay.subscribe((value) => {
            showPopup = !value;
        });
        showPopup = true;
        // Set a timeout to hide the popup 5 seconds after it's shown
        setTimeout(() => {
            showPopup = false;
        }, 5000);
    };
  
    onMount(() => {
      // Set an interval to show the popup every 10 seconds
      interval = setInterval(handlePopup, 20000);
      leisureinterval = setInterval(() => {
            $LeisureTime++;
		}, 1000);
  
      return () => {
        clearInterval(interval);
        clearInterval(leisureinterval);
    }
    });
    
</script>
  
<div class="container">
    <div class="time-display">Leisure time: {formattedTimePassed}</div>
    {#if !showPopup}
      <p>Enjoy your leisure time!</p>
      <p>You earn ${leisurePay.toFixed(2)} every second</p> <!-- Added toFixed(2) for currency formatting -->
    {:else}
      <Popup class="popup" />
    {/if}
</div>

  
<style>
    html, body {
        margin: 0;
        padding: 0;
        height: 100%;
    }
  
    .container {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        text-align: center; 
    }


    .time-display {
        position: absolute;
        height: 60%;
        font-size: 2em; 
        margin: 0.5em 0; 
        color: #4a4a4a; 
        padding: 0.5em; 
        text-align: center; 
    }
  
  
    p {
        margin: 0 0 10px 0;
        font-size: 16px;
        color: #4a4a4a;
    }
  
    .popup {
        width: 200px;
        padding: 10px;
        background-color: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
</style>

  