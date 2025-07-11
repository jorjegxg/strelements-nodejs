import { z } from "zod";

export const stripeCallbackSchema = z.object({
  code: z.string(),
  app_user_id: z.string(), // user ID
});
export const stripeConnectionSchema = z.object({
  app_user_id: z.string(),
});
export const stripeDisconnectSchema = z.object({
  app_user_id: z.string(),
});

export const connectStripeResponseSchema = z.object({
  access_token: z.string(),
  livemode: z.boolean(),
  refresh_token: z.string(),
  token_type: z.string(),
  stripe_publishable_key: z.string(),
  stripe_user_id: z.string(),
  scope: z.string(),
});

export const stripePaymentSchema = z.object({
  amount: z.number(),
  app_user_id: z.number(),
});

export const checkoutSessionSchema = z.object({
  id: z.string(),
  object: z.literal("checkout.session"),
  adaptive_pricing: z.object({
    enabled: z.boolean(),
  }),
  after_expiration: z.null(),
  allow_promotion_codes: z.null(),
  amount_subtotal: z.number(),
  amount_total: z.number(),
  automatic_tax: z.object({
    enabled: z.boolean(),
    liability: z.null(),
    provider: z.null(),
    status: z.null(),
  }),
  billing_address_collection: z.null(),
  cancel_url: z.string().url(),
  client_reference_id: z.null(),
  client_secret: z.null(),
  collected_information: z.null(),
  consent: z.null(),
  consent_collection: z.null(),
  created: z.number(),
  currency: z.string(),
  currency_conversion: z.null(),
  custom_fields: z.array(z.any()),
  custom_text: z.object({
    after_submit: z.null(),
    shipping_address: z.null(),
    submit: z.null(),
    terms_of_service_acceptance: z.null(),
  }),
  customer: z.null(),
  customer_creation: z.string(),
  customer_details: z.null(),
  customer_email: z.null(),
  discounts: z.array(z.any()),
  expires_at: z.number(),
  invoice: z.null(),
  invoice_creation: z.object({
    enabled: z.boolean(),
    invoice_data: z.object({
      account_tax_ids: z.null(),
      custom_fields: z.null(),
      description: z.null(),
      footer: z.null(),
      issuer: z.null(),
      metadata: z.record(z.any()),
      rendering_options: z.null(),
    }),
  }),
  livemode: z.boolean(),
  locale: z.null(),
  metadata: z.record(z.any()),
  mode: z.string(),
  payment_intent: z.null(),
  payment_link: z.null(),
  payment_method_collection: z.string(),
  payment_method_configuration_details: z.object({
    id: z.string(),
    parent: z.null(),
  }),
  payment_method_options: z.object({
    card: z.object({
      request_three_d_secure: z.string(),
    }),
  }),
  payment_method_types: z.array(z.string()),
  payment_status: z.string(),
  permissions: z.null(),
  phone_number_collection: z.object({
    enabled: z.boolean(),
  }),
  recovered_from: z.null(),
  saved_payment_method_options: z.null(),
  setup_intent: z.null(),
  shipping_address_collection: z.null(),
  shipping_cost: z.null(),
  shipping_options: z.array(z.any()),
  status: z.string(),
  submit_type: z.null(),
  subscription: z.null(),
  success_url: z.string().url(),
  total_details: z.object({
    amount_discount: z.number(),
    amount_shipping: z.number(),
    amount_tax: z.number(),
  }),
  ui_mode: z.string(),
  url: z.string().url(),
  wallet_options: z.null(),
});
