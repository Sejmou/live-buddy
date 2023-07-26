import { Socket as ClientSocket } from 'socket.io-client';
import { Socket as ServerSocket } from 'socket.io';

export interface ClientAction {
  name: ClientActionNames;
}

export type ClientActions = {
  startPlayback: () => void;
  stopPlayback: () => void;
};

export type ClientActionNames = keyof ClientActions;

export const emitClientAction: (
  socket: ClientSocket,
  command: ClientAction
) => void = (socket, action) => {
  socket.emit('clientAction', action);
};

export const setupServerActionHandlers = (
  socket: ServerSocket,
  handlers: ClientActions
) => {
  socket.on('clientAction', (action: ClientAction) => {
    console.log('Received client action:', action);
    handlers[action.name]();
  });
};
