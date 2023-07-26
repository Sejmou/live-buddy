import type { ClientActions } from 'api-types';
import { emitClientAction } from 'api-types';
import { type Socket, io } from 'socket.io-client';
import { browser } from '$app/environment';

export const socket = browser ? createSocket() : null; // only the client should ever connect to the socket server!

function createSocket() {
	console.log('initializing socket...');
	const socket = io('http://localhost:3000');

	socket.on('serverhi', (data) => {
		console.log('server said hi:', data);
	});

	return socket;
}

const createClientAPI: (socket: Socket) => ClientActions = (socket) => ({
	startPlayback: () => emitClientAction(socket, { name: 'startPlayback' }),
	stopPlayback: () => emitClientAction(socket, { name: 'stopPlayback' })
});

export const api = socket ? createClientAPI(socket) : null;
