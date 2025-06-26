import { Request, Response } from "express";
import { stripeCallbackSchema } from "./schema";
import { connectStripeAccount } from "./service";

export const stripeCallback = async (req: Request, res: Response) => {
  try {
    // 1. Validare query
    const parsed = stripeCallbackSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "Invalid query params",
        details: parsed.error.errors,
      });
    } else {
      const { code, state } = parsed.data!;

      // 2. Apelare service Stripe
      const stripeUserId = await connectStripeAccount(code);

      // 3. Salvare în pool
      // await pool.query(
      //   "UPDATE streamers SET stripe_account_id = $1 WHERE id = $2",
      //   [stripeUserId, state]
      // );

      // 4. Returnare succes
      res.status(200).json({ stripeUserId });
    }
  } catch (error: any) {
    console.error("❌ Stripe callback error:", error);
    res.status(500).send(error.message);
  }
};
