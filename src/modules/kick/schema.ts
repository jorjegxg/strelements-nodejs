import { z } from "zod";

const authDataSchema = z.object({
  access_token: z.string().min(1, "Missing access_token"),
  expires_in: z.number().min(1, "Missing expires_in"),
  refresh_token: z.string(),
  scope: z.string().min(1, "Missing scope"),
  token_type: z.string().min(1, "Missing token_type"),
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
  // accessToken: z.string(),
});

const headerWithAuthenticationSchema = z.object({
  authorization: z.string().min(1, "Missing authorization"),
});

const getSubscriptionsStateSchema = z.object({
  authorization: z.string(),
});

const tokenRevocationSchema = z.object({
  token_hint_type: z.enum(["access_token", "refresh_token"]),
});

const refreshTokenSchema = z.object({
  refresh_token: z.string().min(1, "Missing refresh token"),
  client_id: z.string().min(1, "Missing client_id"),
  client_secret: z.string().min(1, "Missing client_secret"),
  grant_type: z.string().min(1, "Missing grant_type"),
});

type TokenSchema = z.infer<typeof refreshTokenSchema>;

const channelSchema = z.object({
  data: z.array(
    z.object({
      broadcaster_user_id: z.number(),
      slug: z.string(),
      channel_description: z.string(),
      banner_picture: z.string(),
      stream: z.object({
        url: z.string(),
        key: z.string(),
        is_live: z.boolean(),
        is_mature: z.boolean(),
        language: z.string(),
        start_time: z.string(),
        viewer_count: z.number(),
        thumbnail: z.string(),
      }),
      stream_title: z.string(),
      category: z.object({
        id: z.number(),
        name: z.string(),
        thumbnail: z.string(),
      }),
    })
  ),
  message: z.string(),
});

export {
  authDataSchema,
  channelSchema,
  exchangeCodeSchema,
  getSubscriptionsStateSchema,
  headerWithAuthenticationSchema,
  refreshTokenSchema,
  toggleRequestBodySchema,
  tokenRevocationSchema,
  TokenSchema,
  User,
  usersSchema,
};
