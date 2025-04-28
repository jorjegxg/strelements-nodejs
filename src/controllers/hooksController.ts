import { Request, Response } from "express";
import { Server } from "socket.io";
import {
  subscribeToEvents,
  unsubscribeFromEvents,
} from "../services/hooksService";

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

const handleWebhook = (req: Request, res: Response, io: Server) => {
  const { body , headers } = req;
  console.log("Received webhook headers:",  headers);
  console.log("Webhook received---------------------------:", body);
  const user_id = body.broadcaster.user_id;
  console.log("User ID -----------------------------xxxxxxx---------------------:", user_id);

  if(headers["kick-event-type"] === "livestream.status.updated") {
    io.to(user_id).emit("live", {
      headers: headers,
      body: body,
    }); 
  }else if(headers["kick-event-type"] === "chat.message.sent") {
    io.to(user_id).emit("chat", {
      headers: headers,
      body: body,
    });
  }


  res.status(200).send("Webhook primit cu succes");
};

export { handleSubscribe, handleWebhook };

