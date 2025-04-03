import axios from "axios";
import z from "zod";
import { CONFIG } from "../config/config";

const authDataSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  refresh_token: z.string(),
  scope: z.string(),
  token_type: z.string(),
});
const userSchema = z.object({
  data: z.object({
    active: z.boolean(),
    client_id: z.string(),
    exp: z.number(),
    scope: z.string(),
    token_type: z.string(),
  }),
  message: z.string(),
});

const exchangeAuthCode = async (
  authorizationCode: string,
  codeVerifier: string
) => {
  const body = {
    client_id: CONFIG.CLIENT_ID,
    client_secret: CONFIG.CLIENT_SECRET,
    redirect_uri: CONFIG.FRONTEND_URL + "/callback",
    grant_type: "authorization_code",
    code_verifier: codeVerifier,
    code: authorizationCode,
  };

  try {
    const response = await axios.post(CONFIG.KICK_AUTH_URL, body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return authDataSchema.parse(response.data);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error_description ||
        "Failed to exchange authorization code" + error
    );
  }
};

async function getUser(authorizationToken: string) {
  try {
    const response = await axios.post(
      CONFIG.KICK_API_URL + "/token/introspect",
      {},
      {
        headers: {
          Authorization: `Bearer ${authorizationToken}`,
        },
      }
    );

    return userSchema.parse(response.data);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      console.error("Erori Zod:", error.errors);

      error.errors.forEach((issue) => {
        console.error(`Eroare la ${issue.path.join(".")}: ${issue.message}`);
      });
    } else {
      console.error("Altă eroare:", error);
    }
  }
}

export { exchangeAuthCode, getUser };
