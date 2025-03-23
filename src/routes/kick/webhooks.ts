import express from "express";
import axios from "axios";
import { Request, Response } from "express";
const hooksRouter = express.Router();

hooksRouter.post('/events/subscriptions', async (req: Request, res: Response) => {
    const { accessToken } = req.body;
  
    try {
      const response = await axios.post(
        'https://api.kick.com/public/v1/events/subscriptions',
        {
          events: [
            {
              name: 'chat.message.sent',
              version: 1,
            },
          ],
          method: 'webhook',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
  
  
      console.log(response);
  
      res.json(response.data);
    } catch (error: any) {
      console.error('Error subscribing to events:', error.message);
      res.status(500).send('Error subscribing to events');
    }
});
  

/**
 * @swagger
 * /kick/hooks/webhook:
 * post:
 * summary: Webhook endpoint
 * responses:
 * 200:
 * description: Success
 */
hooksRouter.post('/webhook', (req, res) => {
    const event = req.body;
  
    // Procesăm evenimentul primit de la Kick
    console.log('Eveniment Kick primit:', event);
  
    // Răspunde cu statusul 200 pentru a confirma recepția
    res.status(200).send('Webhook primit cu succes');
});

export default hooksRouter;