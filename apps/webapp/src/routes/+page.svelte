<script lang="ts">
	import SocketState from '$lib/components/SocketState.svelte';
	import SocketMessageLog from '$lib/components/SocketMessageLog.svelte';
	import PlayPause from '$lib/components/PlayPause.svelte';
</script>

<h1>Welcome to the Client App</h1>
<PlayPause />
<SocketState />
<SocketMessageLog />
