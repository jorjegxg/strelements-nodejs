import axios from "axios";
import express from "express";
const hooksRouter = express.Router();

var subcribeToEvents = async (accessToken: string) => {
  const response = await axios.post(
    'https://api.kick.com/public/v1/events/subscriptions',
    {
      //TODO: trebuie sa fie dinamic aici
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
  return response.data;

}

//ruta pentru webhook subscription
hooksRouter.post('/subscribe', async (req, res) => {
  const { accessToken } = req.body;
  try {
    const response = await subcribeToEvents(accessToken);
    res.json(response);
  } catch (error: any) {
    console.error('Error subscribing to events:', error.message);
    res.status(500).send('Error subscribing to events');
  }
});


hooksRouter.post('/webhook', (req, res) => {
  const event = req.body;

  // Procesăm evenimentul primit de la Kick
  console.log('Eveniment Kick primit:', event);

  // Răspunde cu statusul 200 pentru a confirma recepția
  res.status(200).send('Webhook primit cu succes');
});

export { hooksRouter, subcribeToEvents };

