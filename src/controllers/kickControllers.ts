import { Request, Response } from 'express';
import { exchangeAuthCode } from '../services/authService';

const exchangeCode = async (req: Request, res: Response) => {
  const { authorizationCode, codeVerifier } = req.body;

  console.log("Eveniment Kick primit:", req.body);

  //TODO: foloseste zod aici

  if (!authorizationCode || !codeVerifier) {
    res.status(400).json({ error: 'Missing authorizationCode or codeVerifier' });
  }

  console.log('Received authorization code:', authorizationCode);
  console.log('Received code verifier:', codeVerifier);

  try {
    const authData = await exchangeAuthCode(authorizationCode, codeVerifier);
    res.status(200).json(authData);
  } catch (error: any) {
    console.error('Error exchanging code:', error.message);
    res.status(500).send(error.message);
  }
};


export { exchangeCode };


