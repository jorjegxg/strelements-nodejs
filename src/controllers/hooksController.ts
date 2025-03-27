import { Request, Response } from "express";
import { subscribeToEvents } from "../services/hooksService";

const handleSubscribe = async (req: Request, res: Response) => {
  const { accessToken } = req.body;

  //TODO: ZOD
  if (!accessToken) {
    return res.status(400).json({ error: "Missing accessToken" });
  }

  try {
    const response = await subscribeToEvents(accessToken);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: "Error subscribing to events" });
  }
};


const handleWebhook = (req: Request, res: Response) => {
  console.log("Eveniment Kick primit:", req.body);
  res.status(200).send("Webhook primit cu succes");
};

export { handleSubscribe, handleWebhook };

