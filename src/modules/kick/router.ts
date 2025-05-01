import express from "express";

import { validateRequest } from "../../middleware/validation";
import {
  exchangeCode,
  getEffectsState,
  handleSubscribe,
  handleWebhook,
  logout,
  refreshToken,
} from "./controller";
import {
  exchangeCodeSchema,
  refreshTokenSchema,
  toggleRequestBodySchema,
} from "./schema";
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

kickRouter.post(
  "/kick/refresh",
  validateRequest(refreshTokenSchema),
  refreshToken
);

kickRouter.post("/kick/logout", logout);

//delogare:

export default kickRouter;
