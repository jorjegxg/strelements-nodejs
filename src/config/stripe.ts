import Stripe from "stripe";
import { CONFIG } from "./config";

export const stripe = new Stripe(CONFIG.STRIPE_SECRET_KEY);
