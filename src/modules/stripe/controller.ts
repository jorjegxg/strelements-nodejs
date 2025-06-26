// import { Request, Response } from "express";
// import Stripe from "stripe";
// import { stripe } from "../../config/stripe";
// import { saveDonation, updateDonationStatus } from "./service";

// export const handleStripeWebhook = async (req: Request, res: Response) => {
//   const sig = req.headers["stripe-signature"] as string;
//   const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
//   } catch (err) {
//     console.error("⚠️ Webhook error:", err);
//     return res.status(400).send(`Webhook Error: ${err}`);
//   }

//   switch (event.type) {
//     case "checkout.session.completed":
//       const session = event.data.object;
//       await handleCompletedSession(session);
//       break;

//     case "charge.succeeded":
//       const charge = event.data.object;
//       await handleSuccessfulCharge(charge);
//       break;
//   }

//   res.json({ received: true });
// };

// // Helper functions
// const handleCompletedSession = async (session: Stripe.Checkout.Session) => {
//   if (!session.payment_intent) return;

//   // Salvează donația în DB --------------------------------------------------TODO:------------------------------------
//   await saveDonation({
//     amount: session.amount_total ? session.amount_total / 100 : 0,
//     donor_email: session.customer_email || "unknown",
//     streamer_id: session.metadata?.streamer_id || "",
//     stripe_payment_id: session.payment_intent as string,
//     status: "pending",
//   });
// };

// const handleSuccessfulCharge = async (charge: Stripe.Charge) => {
//   // Actualizează statusul în DB când banii ajung la streamer
//   await updateDonationStatus(charge.payment_intent as string, "completed");
// };
