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
    console.log("Livestream status updated event received");

    console.log("Emitting live to room:", user_id);
    io.to(`${user_id}`).emit("live", {
      headers: headers,
      body: body,
    }); 

    //SEE HOW MANY PEOPLE ARE SUBSCRIBED TO SOKET

    const sockets = io.sockets.adapter.rooms.get(user_id);
    if (sockets) {
      console.log(`Number of sockets connected to room ${user_id}: ${sockets.size}`);
    }

    


  }else if(headers["kick-event-type"] === "chat.message.sent") {
    io.to(user_id).emit("chat", {
      headers: headers,
      body: body,
    });
  }


  res.status(200).send("Webhook primit cu succes");
};

export { handleSubscribe, handleWebhook };

