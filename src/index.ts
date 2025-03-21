require('dotenv').config();
import axios from 'axios';
import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import corsMiddleware from './middleware/cors';

import { Server } from 'socket.io';


const app = express();
const io = new Server();

app.use(corsMiddleware);
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

app.post('/exchange-code', async (req: Request, res: Response) => {
  const { authorizationCode, codeVerifier } = req.body;

  console.log('Received code and verifier:', req.body);

  const CLIENT_ID = process.env.CLIENT_ID!;
  //schimba
  //TODO: schimba
  // const REDIRECT_URI = 'www.site.com/callback';
  const REDIRECT_URI = process.env.FRONTEND_URL! + '/callback';
  console.log('REDIRECT_URI:', REDIRECT_URI);
  const TOKEN_URL = 'https://id.kick.com/oauth/token';

  try {
    const params = new URLSearchParams();
    params.append('code', authorizationCode);
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', process.env.CLIENT_SECRET!);
    params.append('redirect_uri', REDIRECT_URI);
    params.append('grant_type', 'authorization_code');
    params.append('code_verifier', codeVerifier);

    const response = await axios.post(TOKEN_URL, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    console.log(response);

    res.json(response.data); // trimite access_token și restul datelor
  } catch (error: any) {
    console.error('Error exchanging code:', error.message);
    res.status(500).send('Error exchanging code');
  }
});

app.post('/webhook', (req, res) => {
  const event = req.body;

  // Procesăm evenimentul primit de la Kick
  console.log('Eveniment Kick primit:', event);

  // Răspunde cu statusul 200 pentru a confirma recepția
  res.status(200).send('Webhook primit cu succes');
});


io.on('connection', (socket) => {
  console.log('A client connected');
  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});



app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Root!' });
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
