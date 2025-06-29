import { Request, Response } from "express";
import { connectStripeResponseSchema, stripeCallbackSchema } from "./schema";
import { connectStripeAccount } from "./service";

export const stripeCallback = async (req: Request, res: Response) => {
  try {
    // 1. Validare query
    const parsedReq = stripeCallbackSchema.safeParse(req.query);
    if (!parsedReq.success) {
      res.status(400).json({
        error: "Invalid query params",
        details: parsedReq.error.errors,
      });
    } else {
      const { code, state } = parsedReq.data!;

      // 2. Apelare service Stripe
      const stripeResponse = await connectStripeAccount(code);

      //3. parsare reapuns cu zod
      const parsedResponse =
        connectStripeResponseSchema.safeParse(stripeResponse);

      if (!parsedResponse.success) {
        res.status(400).json({
          error: "Invalid stripe response",
          details: parsedResponse.error.errors,
        });
      } else {
        // 3. Salvare în pool

        // await pool.query(
        //   "insert into stripe_connections(stripe_connect_id ,app_user_id ) values($1,$2);",
        //   [parsedResponse.data.stripe_user_id, state]
        // );

        // 4. Returnare succes
        res.status(200).json({});
      }
    }
  } catch (error: any) {
    console.error("❌ Stripe callback error:", error);
    res.status(500).send(error.message);
  }
};
export const stripeEvents = async (req: Request, res: Response) => {
  try {
    // 1. Validare query
    // const parsed = stripeCallbackSchema.safeParse(req.body);
    // if (!parsed.success) {
    //   res.status(400).json({
    //     error: "Invalid query params",
    //     details: parsed.error.errors,
    //   });
    // } else {
    //   const { code, state } = parsed.data!;

    //   // 2. Apelare service Stripe
    //   const stripeUserId = await connectStripeAccount(code);

    // 3. Salvare în pool
    // await pool.query(
    //   "UPDATE streamers SET stripe_account_id = $1 WHERE id = $2",
    //   [stripeUserId, state]
    // );
    console.log("req: " + req.body);

    // 4. Returnare succes
    res.status(200).json({});
  } catch (error: any) {
    console.error("❌ Stripe callback error:", error);
    res.status(500).send(error.message);
  }
};
