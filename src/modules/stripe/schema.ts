import { z } from "zod";

export const stripeCallbackSchema = z.object({
  code: z.string(),
  state: z.string(), // user ID
});
