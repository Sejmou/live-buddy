import express from 'express';
import { createServer } from 'http';
import { Socket as ClientSocket, Server as SocketServer } from 'socket.io';
import {
  setupClientActionHandlers,
  createLiveSetStateObservables,
  setupUpdateHandlers,
} from './api';
import { Ableton } from 'ableton-js';

const port = process.env.PORT || 3000;

async function main() {
  const app = express();

  const server = createServer(app);
  const io = new SocketServer(server, {
    cors: {
      origin: '*',
    },
  });

  app.get('/', (req, res) => {
    res.send(
      'Hello World! The interesting part of this server is not here lol'
    );
  });

  const notReadyHandler = (socket: ClientSocket) => {
    // server not yet ready, deny connection
    socket.disconnect();
  };

  io.addListener('connection', notReadyHandler);

  server.listen(port, () => {
    console.log(`listening on *:${port}`);
  });

  const ableton = new Ableton();
  console.log('Waiting for connection to Ableton...');
  await ableton.start();
  console.log('Connected to Ableton.');
  const stateObservables = createLiveSetStateObservables(ableton);

  setupUpdateHandlers(io, stateObservables);

  io.removeListener('connection', notReadyHandler);

  io.on('connection', socket => {
    // server now ready, accept connections

    console.log('a user connected');
    console.log('current number of connections:', io.engine.clientsCount);

    setupClientActionHandlers(socket, {
      startPlayback: () => {
        safelyExecute(() => ableton.song.startPlaying());
      },
      stopPlayback: () => {
        safelyExecute(() => ableton.song.stopPlaying());
      },
      continuePlayback: () => {
        safelyExecute(() => ableton.song.continuePlaying());
      },
    });

    socket.on('disconnect', () => {
      console.log('a user disconnected');
      console.log('current number of connections:', io.engine.clientsCount);
    });
  });

  console.log('Server ready.');
}

main();

/**
 * Wrapper to prevent our app from crashing when an error occurs
 *
 * @param action any action that returns a void promise (e.g. ableton.song.startPlaying())
 */
async function safelyExecute(action: () => Promise<void>) {
  try {
    await action();
  } catch (error) {
    console.error('Error occurred:', error);
  }
}
