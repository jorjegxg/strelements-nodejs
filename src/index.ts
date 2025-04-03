require("dotenv").config();
import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import listEndpoints from "express-list-endpoints";
import { handleSubscribe, handleWebhook } from "./controllers/hooksController";
import { exchangeCode } from "./controllers/kickControllers";
import corsMiddleware from "./middleware/cors";
import { requestLogger } from "./middleware/logger";
import { validateRequest } from "./middleware/validation";
import { exchangeCodeSchema } from "./models/exchangeCodeSchema";
import { toggleRequestBodySchema } from "./models/toogleRequestSchema";

const app = express();

//middleware for logging
app.use(requestLogger);

app.use(corsMiddleware);
app.use(bodyParser.json());
const port = process.env.PORT || 3000;
//////////////////////////////////////////
// app.use('/kick', kickRouter);
app.post(
  "/kick/login/exchange-code",
  validateRequest(exchangeCodeSchema),
  exchangeCode
);
app.post("/kick/hooks", handleWebhook);
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
