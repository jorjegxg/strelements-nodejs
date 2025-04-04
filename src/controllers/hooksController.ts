import { Request, Response } from "express";
import {
  subscribeToEvents,
  unsubscribeFromEvents,
} from "../services/hooksService";
import { Server } from "socket.io";

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
  const { body } = req;
  console.log("Webhook received:", body);
  io.emit("message", body); 
  res.status(200).send("Webhook primit cu succes");
};

export { handleSubscribe, handleWebhook };
