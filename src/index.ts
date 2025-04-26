require("dotenv").config();
import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import listEndpoints from "express-list-endpoints";
import { createServer } from "http";
import { Server } from "socket.io";
import { CONFIG } from "./config/config";
import { handleSubscribe, handleWebhook } from "./controllers/hooksController";
import { exchangeCode } from "./controllers/kickControllers";
import corsMiddleware from "./middleware/cors";
import { requestLogger } from "./middleware/logger";
import { validateRequest } from "./middleware/validation";
import { exchangeCodeSchema } from "./models/exchangeCodeSchema";
import { toggleRequestBodySchema } from "./models/toogleRequestSchema";
// import { instrument } from "@socket.io/admin-ui";

const app = express();
const server = createServer(app); // Folosim serverul Express
const io = new Server(server, {
  cors: {
    origin: [CONFIG.FRONTEND_URL],//, "https://admin.socket.io"],
    methods: ["GET", "POST"],
  },
});

// instrument(io, {
//   auth: false,
// });

///////////////////////////////////////////////////////////////////////////////



io.on("connection", (socket) => {
  console.log('Socket conectat:', socket.id);


  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} s-a alăturat camerei ${room}`);
  });


  // socket.on("message", (message) => {
  //   console.log("Received message:", message);
  //   io.emit("message", message); 
  // });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = CONFIG.PORT; // Folosim CONFIG.PORT
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(listEndpoints(app)); // Mutam listEndpoints aici.
  console.log(`Backend server at http://localhost:${PORT}`);
});

///////////////////////////////////////////////////////////////////////////////

//middleware for logging
// app.use(requestLogger);

app.use(corsMiddleware);
app.use(bodyParser.json());
app.use(requestLogger);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // doar pt test, nu în prod!
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

//////////////////////////////////////////
app.post(
  "/kick/login/exchange-code",
  validateRequest(exchangeCodeSchema),
  exchangeCode
);
app.post("/kick/hooks", (req, res) => handleWebhook(req, res, io));

app.post("/toggle", validateRequest(toggleRequestBodySchema), handleSubscribe);

//////////////////////////////////////////

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Root!" });
});
