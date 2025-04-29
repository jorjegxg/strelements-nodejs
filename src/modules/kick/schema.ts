import { z } from "zod";

const authDataSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  refresh_token: z.string(),
  scope: z.string(),
  token_type: z.string(),
});

const usersSchema = z.object({
  data: z.array(
    z.object({
      user_id: z.number(),
      name: z.string(),
      email: z.string().email(),
      profile_picture: z.string().url(),
    })
  ),
  message: z.string(),
});

type User = z.infer<typeof usersSchema>["data"][number];

const exchangeCodeSchema = z.object({
  authorizationCode: z.string().min(1, "Missing authorizationCode"),
  codeVerifier: z.string().min(1, "Missing codeVerifier"),
});

const toggleRequestBodySchema = z.object({
  isActive: z.boolean(),
  accessToken: z.string(),
});

export {
  authDataSchema,
  exchangeCodeSchema,
  toggleRequestBodySchema,
  User,
  usersSchema,
};
