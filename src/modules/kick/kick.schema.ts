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
      profile_picture: z.string().url()
    })
  ),
  message: z.string(),
});


type User = z.infer<typeof usersSchema>["data"][number];

export { authDataSchema, User, usersSchema };
