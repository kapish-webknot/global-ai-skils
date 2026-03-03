# WebSockets (Socket.io)

## Setup

\`\`\`javascript
import { Server } from 'socket.io';
import { createServer } from 'http';

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('message', (data) => {
    io.emit('message', data);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});
\`\`\`

## Best Practices
- Implement authentication for socket connections
- Use rooms for targeted messaging
- Handle reconnection logic
- Implement rate limiting
- Clean up listeners on disconnect
