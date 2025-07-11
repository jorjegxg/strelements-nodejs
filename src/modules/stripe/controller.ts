import { Request, Response } from "express";
import { CONFIG } from "../../config/config";
import pool from "../../config/db";
import { stripe } from "../../config/stripe";
import {
  checkoutSessionSchema,
  connectStripeResponseSchema,
  stripeCallbackSchema,
  stripeConnectionSchema,
  stripeDisconnectSchema,
  stripePaymentSchema,
} from "./schema";
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
      const { code, app_user_id } = parsedReq.data!;

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
        // 3. Salvare in db a conexiunii
        await pool.query(
          "insert into stripe_connections(stripe_connect_id ,app_user_id ) values($1,$2)",
          [parsedResponse.data.stripe_user_id, app_user_id]
        );

        await createDonationLink(
          parsedResponse.data.stripe_user_id,
          app_user_id
        );

        // 4. Returnare succes
        res.status(200);
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
export const hasStripeConnection = async (req: Request, res: Response) => {
  try {
    // 1. Validare parametri de query
    const parsed = stripeConnectionSchema.safeParse(req.query);

    if (!parsed.success) {
      console.error(
        "❌ Invalid query params for hasStripeConnection:",
        parsed.error.errors
      );
      res.status(400).json({
        error: "Invalid query parameters.",
        details: parsed.error.errors,
      });
      return;
    }

    const { app_user_id } = parsed.data;

    // 2. Interogare bază de date
    const result = await pool.query(
      "SELECT stripe_connect_id FROM STRIPE_CONNECTIONS WHERE APP_USER_ID = $1",
      [app_user_id]
    );

    // 3. Procesarea rezultatului și trimiterea răspunsului
    if (result.rows.length > 0) {
      res.status(200).json({
        hasConnection: true,
        stripe_user_id: result.rows[0].stripe_connect_id,
      });
      return;
    } else {
      res.status(200).json({ hasConnection: false, stripe_user_id: null });
      return;
    }
  } catch (error: any) {
    // 4. Gestionarea erorilor neașteptate
    console.error("❌ Error checking Stripe connection:", error);
    res.status(500).json({
      error:
        "An internal server error occurred while checking Stripe connection.",
      details: error.message,
    });
    return;
  }
};

export const disconnectFromStripe = async (req: Request, res: Response) => {
  try {
    // 1. Validare BODY
    const parsed = stripeDisconnectSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "Invalid request body",
        details: parsed.error.errors,
      });
      return;
    }

    const { app_user_id } = parsed.data!;

    //ia id-ul userului din db
    const stripeResult = await pool.query(
      "SELECT stripe_connect_id FROM STRIPE_CONNECTIONS WHERE APP_USER_ID = $1",
      [app_user_id]
    );

    // Adaugă o verificare dacă utilizatorul are o conexiune Stripe înainte de a încerca să o deconectezi
    if (stripeResult.rows.length === 0) {
      res
        .status(404)
        .json({ error: "Stripe connection didn't found for this user." });
      return;
    }

    const stripeId = stripeResult.rows[0].stripe_connect_id;
    console.log("stripeId pentru deconectare:", stripeId);

    if (!CONFIG.STRIPE_CLIENT_ID) {
      console.error("❌ CONFIG.STRIPE_CLIENT_ID este nedefinit.");
      res.status(500).json({
        error: "Server configuration error: Stripe Client ID missing.",
      });
      return;
    }

    await stripe.oauth.deauthorize({
      client_id: CONFIG.STRIPE_CLIENT_ID,
      stripe_user_id: stripeId,
    });

    // 2. Stergere din db
    await pool.query("DELETE FROM STRIPE_CONNECTIONS WHERE APP_USER_ID = $1", [
      app_user_id,
    ]);

    // 3. Returnare succes
    res.status(200).json({ message: "Successfully disconnected from Stripe." });
  } catch (error: any) {
    console.error("❌ Eroare la deconectarea Stripe:", error);

    res.status(500).json({
      error: "Internal server error during Stripe disconnect.",
      details: error.message,
    });
  }
};
const createDonationLink = async (
  stripe_user_id: string,
  app_user_id: string
) => {
  try {
    //TODO: completeaza aici
  } catch (error: any) {
    console.error("❌ Eroare la crearea linkului Stripe:", error);
  }
};

export const stripePayment = async (req: Request, res: Response) => {
  try {
    const parsed = stripePaymentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "Invalid request body",
        details: parsed.error.errors,
      });
      return;
    }

    const { amount, app_user_id } = parsed.data!;
    /////////////////////////////////
    //get connection id
    const connectionId = await pool.query(
      "SELECT stripe_connect_id FROM STRIPE_CONNECTIONS WHERE APP_USER_ID = $1",
      [app_user_id]
    );
    if (connectionId.rows.length === 0) {
      res
        .status(404)
        .json({ error: "Stripe connection didn't found for this user." });
      return;
    }
    const connectedId = connectionId.rows[0].stripe_connect_id;

    /////////////////////////////////

    const paymentResponse = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Donation",
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: 123,
        transfer_data: {
          destination: connectedId,
        },
      },
      mode: "payment",
      success_url: CONFIG.SUCCESS_URL,
      cancel_url: CONFIG.CANCEL_URL,
    });

    const paymentParsedResponse =
      checkoutSessionSchema.safeParse(paymentResponse);

    res.status(200).json(paymentResponse);
  } catch (error: any) {
    // 4. Gestionarea erorilor neașteptate
    console.error("❌ Error checking Stripe connection:", error);
    res.status(500).json({
      error:
        "An internal server error occurred while checking Stripe connection.",
      details: error.message,
    });
    return;
  }
};
