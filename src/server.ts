require("dotenv").config();
import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import corsMiddleware from "./middleware/cors";
import { requestLogger } from "./middleware/logger";
import kickRouter from "./modules/kick/router";
import stripeRouter from "./modules/stripe/router";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    // origin: [CONFIG.FRONTEND_URL, CONFIG.FRONTEND_URL2, CONFIG.FRONTEND_URL3],
    methods: ["GET", "POST"],
  },
});

app.use(corsMiddleware);
app.use(bodyParser.json());
app.use(requestLogger);

app.use(kickRouter);
app.use(stripeRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Root!" });
});

export { io, server };
