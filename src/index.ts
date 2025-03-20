require('dotenv').config();
import axios from 'axios';
import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import corsMiddleware from './middleware/cors';

const app = express();
app.use(corsMiddleware);
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

app.post('/exchange-code', async (req: Request, res: Response) => {
  const { authorizationCode, codeVerifier } = req.body;

  const CLIENT_ID = process.env.CLIENT_ID!;
  //schimba
  //TODO: schimba
  // const REDIRECT_URI = 'www.site.com/callback';
  const REDIRECT_URI = process.env.FRONTEND_URL! + '/callback';
  const TOKEN_URL = 'https://kick.com/oauth/token';

  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', CLIENT_ID);
    params.append('code', authorizationCode);
    params.append('redirect_uri', REDIRECT_URI);
    params.append('code_verifier', codeVerifier);

    const response = await axios.post(TOKEN_URL, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    res.json(response.data); // trimite access_token și restul datelor
  } catch (error: any) {
    console.error('Error exchanging code:', error.message);
    res.status(500).send('Error exchanging code');
  }
});

//test
app.get('/test', (req: Request, res: Response) => {
  res.send('Hello world!');
});

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Root!' });
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
