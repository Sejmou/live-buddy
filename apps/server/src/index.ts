import express from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { setupServerActionHandlers } from 'api-types';

const app = express();

const server = createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: '*',
  },
});

app.get('/', (req, res) => {
  res.send('Hello World! The interesting part of this server is not here lol');
});

io.on('connection', socket => {
  console.log('a user connected');
  console.log('current number of connections:', io.engine.clientsCount);

  setupServerActionHandlers(socket, {
    startPlayback: () => {
      // TODO: implement this
    },
    stopPlayback: () => {
      // TODO: implement this
    },
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected');
    console.log('current number of connections:', io.engine.clientsCount);
  });

  socket.emit('serverwelcome', 'Welcome, dear client!');
});

setInterval(() => {
  io.emit('serverupdate', {
    to: 'everyone',
    message: 'Just wanted to give you all a quick update',
  });
}, 1000);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
