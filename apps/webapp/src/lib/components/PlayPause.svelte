<script lang="ts">
	import { api } from '$lib/api';
	import { isPlaying } from '$lib/store/live-set';

	const { startPlayback, continuePlayback, stopPlayback: pause } = api;

	let startFromCursor = false; // whether playback should always start from where the cursor is (instead of continuing where last paused)
	$: play = startFromCursor ? startPlayback : continuePlayback;
</script>

{#if $isPlaying}
	<button on:click={pause}>Pause</button>
{:else}
	<button on:click={play}>Play</button>
{/if}
<label>
	<input type="checkbox" bind:checked={startFromCursor} />
	Start playback from cursor
</label>
