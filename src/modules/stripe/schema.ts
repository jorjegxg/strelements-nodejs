import { z } from "zod";

export const StripeAccountSchema = z.object({
  userId: z.string(),
  stripeAccountId: z.string(),
  email: z.string().email(),
  isVerified: z.boolean().default(false),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});

export type StripeAccount = z.infer<typeof StripeAccountSchema>;
