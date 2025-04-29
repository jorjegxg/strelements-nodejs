import express from "express";

import { validateRequest } from "../../middleware/validation";
import {
  exchangeCode,
  getEffectsState,
  handleSubscribe,
  handleWebhook,
} from "./controller";
import { exchangeCodeSchema, toggleRequestBodySchema } from "./schema";
const kickRouter = express.Router();

kickRouter.post(
  "/kick/login/exchange-code",
  validateRequest(exchangeCodeSchema),
  exchangeCode
);
kickRouter.post("/kick/hooks", handleWebhook);

kickRouter.get("/effects-state", getEffectsState);

kickRouter.post(
  "/toggle",
  validateRequest(toggleRequestBodySchema),
  handleSubscribe
);

export default kickRouter;
