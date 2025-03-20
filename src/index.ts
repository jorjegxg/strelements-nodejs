require('dotenv').config();

import axios from 'axios';
import bodyParser from 'body-parser';
import express from 'express';
import corsMiddleware from './middleware/cors';

const app = express();
app.use(corsMiddleware);
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

app.post('/exchange-code', async (req, res) => {
  const { authorizationCode, codeVerifier } = req.body;

  const CLIENT_ID = process.env.CLIENT_ID!;
  //schimba
  // const REDIRECT_URI = 'www.site.com/callback';
  const REDIRECT_URI = 'https://de-ce-o-iubim-pe-gabita.art';
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
    console.error('Error exchanging code:', error.response?.data || error.message);
    res.status(500).send('Error exchanging code');
  }
});

//test
app.get('/test', (req, res) => {
  res.send('Hello world!');
});

app.get('/', (req, res) => {
  res.send('Saluut!');
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
