import axios from "axios";
import { CONFIG } from "../../config/config";
import {
  checkUserExists,
  createSession,
  DbUser,
  insertUserInDb,
} from "./model";
import {
  authDataSchema,
  channelSchema,
  TokenSchema,
  User,
  usersSchema,
} from "./schema";

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

async function getCurrentUser(authorizationToken: string): Promise<User> {
  try {
    const response = await axios.get(CONFIG.KICK_API_URL + "/users", {
      headers: {
        Authorization: `Bearer ${authorizationToken}`,
      },
    });

    const users = usersSchema.parse(response.data);

    return users.data[0];
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

    if (subscriptions.data.length === 0) {
      return { message: "No subscriptions to unsubscribe from" };
    }

    await Promise.all(
      subscriptions.data.map((sub: { id: string }) =>
        axios.delete(
          `https://api.kick.com/public/v1/events/subscriptions?id=${sub.id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
      )
    );

    return { message: "Unsubscribed from events" };
  } catch (error: any) {
    throw new Error(error || "Failed to unsubscribe from events");
  }
};

const revokeAuthToken = async (accessToken: string, tokenType: string) => {
  try {
    const response = await axios.post(
      `https://id.kick.com/oauth/revoke?token=${accessToken}&token_hint_type=${tokenType}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error_description ||
        `Failed to revoke token ${error}`
    );
  }
};

const refreshKickToken = async (tokenSchema: TokenSchema) => {
  try {
    console.log("tokenSchema----------------------", tokenSchema);
    const response = await axios.post(
      "https://id.kick.com/oauth/token",
      tokenSchema,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error_description ||
        `Failed to refresh token ${error}`
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

const getChannel = async (accessToken: string) => {
  try {
    const response = await axios.get(
      "https://api.kick.com/public/v1/channels",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const parsedResponse = channelSchema.parse(response.data);

    return parsedResponse;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error_description ||
        `Failed to get channel information ${error}`
    );
  }
};

async function loginWithKick(authorizationCode: any, codeVerifier: any) {
  let authData = await exchangeAuthCode(authorizationCode, codeVerifier);
  console.log("1");

  const currentUser = await getCurrentUser(authData.access_token);
  console.log("2 currentUser---------", currentUser);

  await createUserOrSession({
    name: currentUser!.name,
    email: currentUser!.email,
    kick_id: currentUser!.user_id,
  });
  console.log("3");

  let response = {
    authData: authData,
    user: currentUser,
  };
  return response;
}

const createUserOrSession = async (user: DbUser) => {
  try {
    console.log("2.1");
    const userExists = await checkUserExists(user.kick_id);
    console.log("2.2");
    console.log("userExists---------", userExists);

    if (userExists.exists) {
      console.log("User already exists, creating session");
      await createSession(userExists.userId);
      console.log("2.3");
    } else {
      console.log("User does not exist, inserting into DB");
      const userId = await insertUserInDb(user);
      console.log("2.4");
      await createSession(userId);
      console.log("2.5");
      console.log("User created and session established");
    }
  } catch (error) {
    console.error("Error creating user or session:", error);
    throw new Error("Failed to create user or session");
  }
};
export {
  getChannel,
  getSubscriptions,
  loginWithKick,
  refreshKickToken,
  revokeAuthToken,
  subscribeToEvents,
  unsubscribeFromEvents,
};
