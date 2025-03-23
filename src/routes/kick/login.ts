import express from "express";
import axios from "axios";
import { Request, Response } from "express";
const loginRouter = express.Router();

loginRouter.post('/exchange-code', async (req: Request, res: Response) => {
  const { authorizationCode, codeVerifier } = req.body;

  console.log('Received code and verifier:', req.body);

  const CLIENT_ID = process.env.CLIENT_ID!;
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

    res.json(response.data);
  } catch (error: any) {
    console.error('Error exchanging code:', error.message);
    res.status(500).send('Error exchanging code');
  }
});

export default loginRouter;