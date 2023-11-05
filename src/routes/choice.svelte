<script>
    import {
		elapsed,
		game,
		earned,
		history,
		logHistory
	} from '$lib/stores.js';

    function goToLeisure() {
        $game.inLeisure = true;
        $game.inChoices = false;
        logHistory(`choose leisure`);
    }

    function goToWork() {
        $game.inChoices = false;
        $game.inLeisure = false;
        logHistory(`choose to work`);
    }
</script>
  
<div>
    <button on:click={goToLeisure}>Leisure</button>
    <button on:click={goToWork}>Work</button>
</div>

<style>
    div {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 100vh;
      background-color: #f0f0f0;
    }
  
    button {
      padding: 10px 20px;
      font-size: 16px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
  
    button:hover {
      background-color: #e0e0e0;
    }
  
    button:active {
      background-color: #d0d0d0;
    }
</style>
  