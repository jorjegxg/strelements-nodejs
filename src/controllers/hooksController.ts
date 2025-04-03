import { Request, Response } from "express";
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

const handleWebhook = (req: Request, res: Response) => {
  res.status(200).send("Webhook primit cu succes");
};

export { handleSubscribe, handleWebhook };
