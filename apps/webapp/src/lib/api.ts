/* eslint-disable @typescript-eslint/no-empty-function */
import { io, type Socket } from 'socket.io-client';
import { browser } from '$app/environment';
import type { ClientAction, ClientAPI } from 'api';

function createSocket() {
	console.log('initializing socket...');
	const socket = io('http://localhost:3000');

	return socket;
}

const emitActionViaSocket: (action: ClientAction, socket: Socket) => void = (action, socket) => {
	console.log(`emitting action ${action} via socket...`);
	socket.emit(action);
};

const createClientSocketAPI: (socket: Socket) => ClientAPI = (socket) => ({
	startPlayback: () => emitActionViaSocket('startPlayback', socket),
	continuePlayback: () => emitActionViaSocket('continuePlayback', socket),
	stopPlayback: () => emitActionViaSocket('stopPlayback', socket)
});

// this is required because the API library code also runs on the server, where there is no socket connection to the server
const createNoopClientAPI: () => ClientAPI = () => ({
	startPlayback: () => {},
	continuePlayback: () => {},
	stopPlayback: () => {}
});

export const socket = browser ? createSocket() : null; // only the client should ever connect to the socket server!
export const api = socket ? createClientSocketAPI(socket) : createNoopClientAPI();
