require("dotenv").config();
import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import listEndpoints from "express-list-endpoints";
import { createServer } from "http";
import { Server } from "socket.io";
import { handleSubscribe, handleWebhook } from "./controllers/hooksController";
import { exchangeCode } from "./controllers/kickControllers";
import corsMiddleware from "./middleware/cors";
import { requestLogger } from "./middleware/logger";
import { validateRequest } from "./middleware/validation";
import { exchangeCodeSchema } from "./models/exchangeCodeSchema";
import { toggleRequestBodySchema } from "./models/toogleRequestSchema";
import { CONFIG } from "./config/config";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: CONFIG.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});
///////////////////////////////////////////////////////////////////////////////

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("message", (message) => {
    console.log("Received message:", message);
    io.emit("message", message); // Trimite mesajul către toți clienții
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

///////////////////////////////////////////////////////////////////////////////

//middleware for logging
// app.use(requestLogger);

app.use(corsMiddleware);
app.use(bodyParser.json());
const port = CONFIG.PORT;
//////////////////////////////////////////
app.post(
  "/kick/login/exchange-code",
  validateRequest(exchangeCodeSchema),
  exchangeCode
);
app.post("/kick/hooks", (req, res) => handleWebhook(req, res, io));

app.post("/toggle", validateRequest(toggleRequestBodySchema), handleSubscribe);

//////////////////////////////////////////
app.use(requestLogger);
console.log(listEndpoints(app));

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Root!" });
});

app.listen(port, () => {
  console.log(`Backend server at http://localhost:${port}`);
});
