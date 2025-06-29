import { stripe } from "../../config/stripe";

export const connectStripeAccount = async (code: string) => {
  const response = await stripe.oauth.token({
    grant_type: "authorization_code",
    code: code,
  });
  console.log("response", response);

  return response;
};
