import { Server } from 'socket.io';
import { createServer } from 'http';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const users = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userData) => {
    users.set(socket.id, {
      id: socket.id,
      name: userData.name,
      color: userData.color
    });
    
    io.emit('users', Array.from(users.values()));
  });

  socket.on('disconnect', () => {
    users.delete(socket.id);
    io.emit('users', Array.from(users.values()));
  });

  socket.on('code-change', (data) => {
    socket.broadcast.emit('code-update', {
      userId: socket.id,
      changes: data
    });
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Collaboration server running on port ${PORT}`);
}); 