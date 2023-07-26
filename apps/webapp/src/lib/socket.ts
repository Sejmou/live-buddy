import socketioSocket from 'socket.io-client';
import { readable } from 'svelte/store';
import { browser } from '$app/environment';

type SocketState = 'connected' | 'disconnected' | 'initializing';

function createSocket() {
	console.log('initializing socket...');
	const socket = socketioSocket('http://localhost:3000');

	socket.on('serverhi', (data) => {
		console.log('server said hi:', data);
	});

	return socket;
}

export const socket = browser ? createSocket() : null; // only the client should ever connect to the socket server!

// Subscribe to this store in components (using $state) to get the current state of the socket
export const state = readable<SocketState>('initializing', (set) => {
	if (!socket) {
		// only possible if this code is imported and run on SSR server, not in browser!
		set('initializing');
		return;
	}

	socket.on('connect', () => {
		console.log('connected to socket server');
		set('connected');
	});

	socket.on('connect_error', (err) => {
		console.log('could not connect to socket server:', err);
		set('disconnected');
	});

	socket.on('disconnect', () => {
		console.log('disconnected from socket server');
		set('disconnected');
	});

	//TODO: verify that isConnected can ONLY change after either of the above events
});

export type ServerMessage = {
	date: Date;
	name: string;
	content: unknown;
};

export const message = readable<ServerMessage>(undefined, (set) => {
	socket?.onAny((message, args) => {
		set({
			date: new Date(),
			name: message,
			content: args
		});
	});
});
