// routes/stripe.routes.ts
import express from "express";
import { stripeCallback } from "./controller";

const stripeRouter = express.Router();

stripeRouter.get("/stripe/callback", stripeCallback);

export default stripeRouter;
