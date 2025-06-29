import { z } from "zod";

export const stripeCallbackSchema = z.object({
  code: z.string(),
  state: z.string(), // user ID
});

export const connectStripeResponseSchema = z.object({
  access_token: z.string(),
  livemode: z.string(),
  refresh_token: z.string(),
  token_type: z.string(),
  stripe_publishable_key: z.string(),
  stripe_user_id: z.string(),
  scope: z.string(),
});
