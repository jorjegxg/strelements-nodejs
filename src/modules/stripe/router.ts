// routes/stripe.routes.ts
import express from "express";
import {
  disconnectFromStripe,
  hasStripeConnection,
  stripeCallback,
  stripeEvents,
  stripePayment,
} from "./controller";

const stripeRouter = express.Router();

//
stripeRouter.post("/stripe/events", stripeEvents);
//
stripeRouter.post("/stripe/disconnect", disconnectFromStripe);
stripeRouter.get("/stripe/callback", stripeCallback);
stripeRouter.get("/stripe/connection", hasStripeConnection);
stripeRouter.post("/stripe/donation", stripePayment);

export default stripeRouter;
