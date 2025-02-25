import { Server } from "socket.io";

export default function socketIo(io: Server) {
  io.on("connection", (socket) => {
    socket.emit("connector", { message: "a new client connected" });

    socket.on("join_room", (data) => {
      socket.join(data.room);
    });

    socket.on("new_message", (data) => {
      io.to(data.room).emit("receive_message", data.message);
    });
  });
}
