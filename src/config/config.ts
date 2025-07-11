export const CONFIG = {
  CLIENT_ID: process.env.CLIENT_ID!,
  CLIENT_SECRET: process.env.CLIENT_SECRET!,
  FRONTEND_URL: process.env.FRONTEND_URL!,
  KICK_AUTH_URL: "https://id.kick.com/oauth/token",
  KICK_API_URL: "https://api.kick.com/public/v1",
  PORT: process.env.PORT || 3000,

  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DATABASE: process.env.DATABASE,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,

  DATABASE_URL: process.env.DATABASE_URL,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY!,
  STRIPE_CLIENT_ID: process.env.STRIPE_CLIENT_ID!,

  SUCCESS_URL: process.env.SUCCESS_URL!,
  CANCEL_URL: process.env.CANCEL_URL!,
};
