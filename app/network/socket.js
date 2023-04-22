import { io } from "socket.io-client";
const socket = io.connect("http://localhost:4000");
socket.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on('disconnect', () => {
      socket.disconnect()
      console.log('🔥: A user disconnected');
    });
});
export default socket;