// routes/stripe.routes.ts
import express from "express";
import {
  hasStripeConnection,
  stripeCallback,
  stripeEvents,
} from "./controller";

const stripeRouter = express.Router();

stripeRouter.get("/stripe/callback", stripeCallback);
stripeRouter.post("/stripe/events", stripeEvents);
stripeRouter.get("/stripe/connection", hasStripeConnection);

export default stripeRouter;
