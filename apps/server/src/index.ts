import express from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';

const app = express();

const server = createServer(app);
const io = new SocketServer(
  server
  //   {
  //   cors: {
  //     origin: '*',
  //     methods: ['GET', 'POST']
  //   }
  // }
);

app.get('/', (req, res) => {
  res.send('Hello World! The interesting part of this server is not here lol');
});

io.on('connection', socket => {
  console.log('a user connected');
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
