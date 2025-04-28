// src/routes/apiRoutes.ts
import { Router } from "express";
import { handleWebhook } from "../../controllers/hooksController";
import { validateRequest } from "../../middleware/validation";
import { exchangeCodeSchema } from "../../models/exchangeCodeSchema";
import { kickController } from "./kick.controller";

const kickRoutes = Router();

kickRoutes.post(
  "/login/exchange-code",
  validateRequest(exchangeCodeSchema),
  (req, res) => kickController.exchangeCode(req, res)

);

kickRoutes.post("/hooks", handleWebhook); 

export default kickRoutes;
