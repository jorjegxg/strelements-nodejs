import axios from "axios";
import { CONFIG } from "../../config/config";
import { authDataSchema, User, usersSchema } from "./schema";

const exchangeAuthCode = async (
  authorizationCode: string,
  codeVerifier: string
) => {
  try {
    const body = {
      client_id: CONFIG.CLIENT_ID,
      client_secret: CONFIG.CLIENT_SECRET,
      redirect_uri: CONFIG.FRONTEND_URL + "/callback",
      grant_type: "authorization_code",
      code_verifier: codeVerifier,
      code: authorizationCode,
    };

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
    throw new Error(
      error.response?.data?.error_description ||
        "Failed to get current user" + error
    );
  }
}

const subscribeToEvents = async (accessToken: string) => {
  const body = {
    events: [
      {
        name: "chat.message.sent",
        version: 1,
      },
      {
        name: "livestream.status.updated",
        version: 1,
      },
      {
        name: "channel.followed",
        version: 1,
      },
      {
        name: "channel.subscription.new",
        version: 1,
      },
      {
        name: "channel.subscription.renewal",
        version: 1,
      },
      {
        name: "channel.subscription.gifts",
        version: 1,
      },
    ],
    method: "webhook",
  };

  try {
    const response = await axios.post(
      "https://api.kick.com/public/v1/events/subscriptions",
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error_description || "Failed to subscribe to events"
    );
  }
};

const unsubscribeFromEvents = async (accessToken: string) => {
  try {
    const subscriptions = await getSubscriptions(accessToken);

    for (const index in subscriptions.data) {
      await axios.delete(
        `https://api.kick.com/public/v1/events/subscriptions?id=${subscriptions.data[index].id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return { message: "Unsubscribed from events" };
    }

    return { message: "Nothing to unsubscribe" };
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error_description ||
        "Failed to unsubscribe from events"
    );
  }
};

const getSubscriptions = async (accessToken: string) => {
  try {
    const response = await axios.get(
      "https://api.kick.com/public/v1/events/subscriptions",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error_description ||
        `Failed to get subscriptions ${error}`
    );
  }
};

export {
  exchangeAuthCode,
  getCurrentUser,
  subscribeToEvents,
  unsubscribeFromEvents,
};
