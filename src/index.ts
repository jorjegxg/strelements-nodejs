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
import { instrument } from "@socket.io/admin-ui";

const app = express();
const server = createServer(app); // Folosim serverul Express

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

//////////////////////////////////////////
app.post(
  "/kick/login/exchange-code",
  validateRequest(exchangeCodeSchema),
  exchangeCode
);
// app.post("/kick/hooks", (req, res) => handleWebhook(req, res, io));

app.post("/toggle", validateRequest(toggleRequestBodySchema), handleSubscribe);

//////////////////////////////////////////
app.use(requestLogger);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Root!" });
});