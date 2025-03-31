import { Request, Response } from "express";
import { subscribeToEvents, unsubscribeFromEvents } from "../services/hooksService";

const handleSubscribe = async (req: Request, res: Response) => {
  console.log("HandleSubscribe");
  const { accessToken, isActive } = req.body;
  let data = null;

  console.log("accessToken:", accessToken);
  console.log("isActive:", isActive);

  try {
    if (isActive === true) {
      data = await unsubscribeFromEvents(accessToken);
    } else {
      data = await subscribeToEvents(accessToken);
    }

    res.json(data);
  } catch (error: any) {
    console.error("Error subscribing to events:", error);
    res.status(500).json({ error: "Error subscribing to events" });
  }
};


const handleWebhook = (req: Request, res: Response) => {
  console.log("Eveniment Kick primit:", req.body);
  res.status(200).send("Webhook primit cu succes");
};

export { handleSubscribe, handleWebhook };

