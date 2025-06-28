// routes/stripe.routes.ts
import express from "express";
import { stripeCallback, stripeEvents } from "./controller";

const stripeRouter = express.Router();

stripeRouter.get("/stripe/callback", stripeCallback);
stripeRouter.get("/stripe/events", stripeEvents);

export default stripeRouter;
