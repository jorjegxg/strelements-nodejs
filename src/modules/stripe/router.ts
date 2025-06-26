// routes/stripe.routes.ts
import express from "express";
import { oAuthCallback } from "./controller";

const stripeRouter = express.Router();

stripeRouter.get("/stripe/callback", oAuthCallback);

export default stripeRouter;
