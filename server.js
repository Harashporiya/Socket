const express = require("express")
const app = express()
const {Server} = require("socket.io")
const {createServer} = require("http")
require('dotenv').config();
const PORT = process.env.PORT ?? 3000;
const server = createServer(app);

const allowedOrigins = [process.env.FRONTEND_URL, process.env.FRONTEND_DEPLOY_URL, process.env.FRONTEND_DEPLOY_URL_VERCEL];


const io = new Server(server, {
    cors: {
        origin: allowedOrigins, 
        credentials: true,
    }
});

io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("join_room", ({ joinRoomId }) => {
        const roomName = joinRoomId;
        socket.join(roomName);
        console.log(`User ${socket.id} joined room ${roomName}`);
    });

    socket.on("send_message", ({ joinRoomId,  message, senderId }) => {
        const roomName = joinRoomId;
        console.log(`Sending message to room ${roomName}:`, message);
       
        io.to(roomName).emit("receive_message", { message, senderId });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server Started at PORT: ${PORT}`);
});