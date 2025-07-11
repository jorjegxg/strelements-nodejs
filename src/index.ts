import "dotenv/config";

import { CONFIG } from "./config/config";
import { io, server } from "./server";

io.on("connection", (socket) => {
  console.log("Socket conectat:", socket.id);

  socket.on("join_room", async (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} s-a alăturat camerei ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = CONFIG.PORT;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Backend server at http://localhost:${PORT}`);
});
