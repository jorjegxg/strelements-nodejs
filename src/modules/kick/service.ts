import axios from "axios";
import { z } from "zod";
import { CONFIG } from "../../config/config";
import { authDataSchema, User, usersSchema } from "./schema";

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

async function getCurrentUser(
  authorizationToken: string
): Promise<User | undefined> {
  try {
    const response = await axios.get(CONFIG.KICK_API_URL + "/users", {
      headers: {
        Authorization: `Bearer ${authorizationToken}`,
      },
    });

    const users = usersSchema.parse(response.data);

    return response.data.data[0];
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

export { exchangeAuthCode, getCurrentUser };
