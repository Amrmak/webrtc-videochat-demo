const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 3030;

io.on("connection", socket => {
  console.log(`${socket.id} connected`);

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
  });

  // This is where the exchange of information/messages happens
  socket.on("msg", msg => {
    console.log(`${msg.action} from ${msg.from} to ${msg.to}`);
    return socket.broadcast.to(msg.to).emit("msg", msg);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
