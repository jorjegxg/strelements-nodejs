import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { CONFIG } from "./config/config";
import corsMiddleware from "./middleware/cors";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/logger";

const app = express();

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: CONFIG.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

app.use(corsMiddleware);
app.use(express.json());
app.use(requestLogger);

app.get("/", (req, res) => {
  res.json({ message: "Root!" });
});

app.use(errorHandler);

export { app, io, server };

