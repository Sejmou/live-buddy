<script lang="ts">
	import { message, type ServerMessage } from '$lib/socket-log';
	import { derived, type Readable } from 'svelte/store';

	// TODO: figure out if the is a smarter way to store the last 10 messages and update the UI accordingly
	const messages: ServerMessage[] = [];

	const lastMessages = derived<Readable<ServerMessage>, ServerMessage[]>(
		message,
		($message, set) => {
			if (!$message) {
				set(messages);
				return;
			}
			messages.push($message);
			if (messages.length > 10) {
				messages.shift();
			}
			set(messages);
		}
	);

	function parseMessageToString(msg: unknown) {
		if (typeof msg === 'string') {
			return msg;
		}
		return JSON.stringify(msg);
	}
</script>

<div>
	<h2>Last Socket Messages</h2>
	displaying up to 10 messages
	<table>
		<tr>
			<th>Time</th>
			<th>Name</th>
			<th>Content</th>
		</tr>
		{#each $lastMessages as message}
			<tr>
				<td>{message.date.toLocaleTimeString()}</td>
				<td>{message.name}</td>
				<td>{parseMessageToString(message.content)}</td>
			</tr>
		{/each}
	</table>
</div>
