<script lang="ts">
	import { state } from '$lib/socket-log';
</script>

<div>
	<h2>Server Socket Connection state</h2>
	{#if $state != 'initializing'}
		<p>{$state}</p>
	{/if}
	{#if $state == 'disconnected'}
		<p class="error">If you aren't expecting this, check the browser console for errors.</p>
	{/if}
</div>

<style>
	.error {
		color: red;
	}
</style>
