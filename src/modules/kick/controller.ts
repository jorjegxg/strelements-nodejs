import { Request, Response } from "express";
import { io } from "../../server";
import {
  subscribeToEvents,
  unsubscribeFromEvents,
} from "../../services/hooksService";
import { exchangeAuthCode, getCurrentUser } from "./service";

const exchangeCode = async (req: Request, res: Response) => {
  const { authorizationCode, codeVerifier } = req.body;

  try {
    let authData = await exchangeAuthCode(authorizationCode, codeVerifier);

    const [_, currentUser] = await Promise.all([
      subscribeToEvents(authData.access_token),
      getCurrentUser(authData.access_token),
    ]);

    let response = {
      authData: authData,
      user: currentUser,
    };

    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

const handleSubscribe = async (req: Request, res: Response) => {
  const { accessToken, isActive } = req.body;
  let data = null;

  try {
    if (isActive === true) {
      data = await unsubscribeFromEvents(accessToken);
    } else {
      data = await subscribeToEvents(accessToken);
    }

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: "Error subscribing to events" });
  }
};

const handleWebhook = (req: Request, res: Response) => {
  const { body, headers } = req;

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

export { exchangeCode, handleSubscribe, handleWebhook };
