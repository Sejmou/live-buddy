<script lang="ts">
	import SocketState from '$lib/components/SocketState.svelte';
	import SocketMessageLog from '$lib/components/SocketMessageLog.svelte';
	import SendMessageTest from '$lib/components/SendMessageTest.svelte';
</script>

<h1>Welcome to the Client App</h1>
<SendMessageTest />
<SocketState />
<SocketMessageLog />
