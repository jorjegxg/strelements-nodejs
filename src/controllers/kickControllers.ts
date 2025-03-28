import { Request, Response } from 'express';
import { exchangeAuthCode } from '../services/authService';
import { subscribeToEvents } from '../services/hooksService';

const exchangeCode = async (req: Request, res: Response) => {
  const { authorizationCode, codeVerifier } = req.body;

  console.log("Eveniment Kick primit:", req.body);

  //TODO: foloseste zod aici

  if (!authorizationCode || !codeVerifier) {
    res.status(400).send('Missing required parameters');
  }

  console.log('Received authorization code:', authorizationCode);
  console.log('Received code verifier:', codeVerifier);

  try {
    const authData = await exchangeAuthCode(authorizationCode, codeVerifier);

    console.log('Received auth data:', authData);
    await subscribeToEvents(authData.access_token);

    console.log('Subscribed to events');
    res.json(authData);
  } catch (error: any) {
    console.error('Error exchanging code:', error.message);
    res.status(500).send(error.message);
  }
};


export { exchangeCode };


