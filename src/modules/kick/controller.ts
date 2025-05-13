import { Request, Response } from "express";
import { io } from "../../server";

import { ApiError } from "../../utils/ApiError";
import {
  exchangeCodeSchema,
  getSubscriptionsStateSchema,
  headerWithAuthenticationSchema,
  refreshTokenSchema,
  toggleRequestBodySchema,
  tokenRevocationSchema,
  TokenSchema,
} from "./schema";
import {
  getChannel,
  getSubscriptions,
  loginWithKick,
  refreshKickToken,
  revokeAuthToken,
  subscribeToEvents,
  unsubscribeFromEvents,
} from "./service";

//1.validare date
// 2.apelare service cu datele validate
// 3.returnare succes
// 4.1 returnare eroare api
// 4.2 Returnare orice alta eroare

const kickLogin = async (req: Request, res: Response) => {
  try {
    // 1.validare date
    const parsedBody = exchangeCodeSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({
        error: "Invalid request body",
        details: parsedBody.error.errors,
      });
    }

    // 2.apelare service cu datele validate
    const { authorizationCode, codeVerifier } = req.body;
    let response = await loginWithKick(authorizationCode, codeVerifier);

    console.log("response ------------------------ ", response);

    // 3.returnare succes
    res.status(200).json(response);
  } catch (error: any) {
    // 4.1 returnare eroare api
    console.error("❌ Error:", error);
    // 4.2 Returnare orice alta eroare
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ error: error.message });
    }

    res.status(500).send(error.message);
  }
};

const handleSubscribe = async (req: Request, res: Response) => {
  // TODO: aici este o eroare daca dai de prea multe ori pe switch, daca o apelezi de prea multe ori repede
  try {
    //1.validare date
    const parsedBody = toggleRequestBodySchema.safeParse(req.body);
    const parsedHeaders = headerWithAuthenticationSchema.safeParse(req.headers);
    if (!parsedBody.success || !parsedHeaders.success) {
      res.status(400).json({
        error: "Invalid request body",
        details: parsedBody?.error?.errors || parsedHeaders?.error?.errors,
      });
    }

    // 2.apelare service cu datele validate
    const { isActive } = req.body;
    const { authorization } = req.headers;

    let data = null;

    if (isActive === false) {
      console.log("Unsubscribing from events...");
      data = await unsubscribeFromEvents(authorization!);
    } else {
      data = await subscribeToEvents(authorization!);
    }

    // 3.returnare succes
    res.status(200).json(data);
  } catch (error: any) {
    // 4.1 returnare eroare api
    console.error("❌ Error:", error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ error: error.message });
    }
    // 4.2 Returnare orice alta eroare
    res.status(500).send(error.message);
  }
};

const handleWebhook = (req: Request, res: Response) => {
  const { body, headers } = req;

  console.log(
    "headers -----------------------------xxxxxxx---------------------:"
  );
  console.log(headers);
  console.log(
    "body -----------------------------xxxxxxx---------------------:"
  );
  console.log(body);

  if (headers["kick-event-type"] === "livestream.status.updated") {
    const user_id = body.broadcaster.user_id;

    console.log(
      " LIVE User ID -----------------------------xxxxxxx---------------------:",
      user_id
    );

    io.to(`${user_id}`).emit("live", {
      headers: headers,
      body: body,
    });
  } else if (headers["kick-event-type"] === "chat.message.sent") {
    const user_id = body.broadcaster.user_id;

    console.log(
      " CHAT MESSAGE User ID -----------------------------xxxxxxx---------------------:",
      user_id
    );

    io.to(`${user_id}`).emit("chat", {
      headers: headers,
      body: body,
    });
  }

  res.status(200).send("Webhook primit cu succes");
};

const getEffectsState = async (req: Request, res: Response) => {
  try {
    // 1.validare date
    const parsedHeaders = getSubscriptionsStateSchema.safeParse(req.headers);
    if (!parsedHeaders.success) {
      res.status(400).json({
        error: "Invalid headers",
        details: parsedHeaders.error.errors,
      });
    }

    // 2.apelare service cu datele validate
    const headers = req.headers;
    const authorization = headers["authorization"];
    console.log("accessToken--------------", authorization);

    // TODO: repara:
    let data = await getSubscriptions(authorization!);

    const areEffectsActive = data.data.length > 0;
    console.log(areEffectsActive);

    // 3.returnare succes
    res.status(200).json({
      isActive: areEffectsActive,
    });
  } catch (error: any) {
    // 4.1 returnare eroare api
    console.error("❌ Error:", error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ error: error.message });
    }
    // 4.2 Returnare orice alta eroare
    res.status(500).send(error.message);
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    // 1.validare date
    const parsedBody = tokenRevocationSchema.safeParse(req.body);
    const parsedHeaders = headerWithAuthenticationSchema.safeParse(req.headers);

    if (!parsedBody.success || !parsedHeaders.success) {
      res.status(400).json({
        error: "Invalid request body or headers",
        details: parsedBody?.error?.errors || parsedHeaders?.error?.errors,
      });
    }

    console.log("parsedBody--------", parsedBody);
    console.log("parsedHeaders--------", parsedHeaders);

    // 2.apelare service cu datele validate
    const { token_hint_type } = parsedBody.data!;
    const { authorization } = parsedHeaders.data!;

    await unsubscribeFromEvents(authorization),
      await revokeAuthToken(authorization, token_hint_type),
      // 3.returnare succes
      res.status(200).json({
        message: "Logout successful",
      });
  } catch (error: any) {
    // 4.1 returnare eroare api
    console.error("❌ Error:", error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ error: error.message });
    }
    // 4.2 Returnare orice alta eroare
    res.status(500).send(error.message);
  }
};
const refreshToken = async (req: Request, res: Response) => {
  try {
    // 1.validare date
    const parsedBody = refreshTokenSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({
        error: "Invalid request body",
        details: parsedBody.error.errors,
      });
    }

    console.log("parsedBody--------", parsedBody);

    // 2.apelare service cu datele validate
    let tokenSchema: TokenSchema = {
      client_id: parsedBody.data!.client_id,
      client_secret: parsedBody.data!.client_secret,
      grant_type: parsedBody.data!.grant_type,
      refresh_token: parsedBody.data!.refresh_token,
    };
    // const { tokenSchema } = parsedBody.data;

    console.log("tokenSchema--------", tokenSchema);

    const newTokens = await refreshKickToken(tokenSchema);

    console.log("newTokens--------", newTokens);
    // 3.returnare succes
    res.status(200).json(newTokens);
  } catch (error: any) {
    console.log("errorrrrrrr--------", error);
    // 4.1 returnare eroare api
    console.error("❌ Error:", error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ error: error.message });
    }
    // 4.2 Returnare orice alta eroare
    res.status(500).send(error.message);
  }
};

const getChannelInformation = async (req: Request, res: Response) => {
  console.log("getChannelInformation");
  try {
    // 1.validare date
    const parsedHeaders = headerWithAuthenticationSchema.safeParse(req.headers);
    if (!parsedHeaders.success) {
      res.status(400).json({
        error: "Invalid headers",
        details: parsedHeaders.error.errors,
      });
    }

    // 2.apelare service cu datele validate
    const headers = req.headers;
    const authorization = headers["authorization"];
    console.log("accessToken--------------", authorization);

    let data = await getChannel(authorization!);

    // 3.returnare succes
    res.status(200).json(data);
  } catch (error: any) {
    // 4.1 returnare eroare api
    console.error("❌ Error:", error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ error: error.message });
    }
    // 4.2 Returnare orice alta eroare
    res.status(500).send(error.message);
  }
};

export {
  getChannelInformation,
  getEffectsState,
  handleSubscribe,
  handleWebhook,
  kickLogin,
  logout,
  refreshToken,
};
