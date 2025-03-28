import { Request } from 'express';
import { exchangeAuthCode } from '../services/authService';
import { subscribeToEvents } from '../services/hooksService';

const exchangeCode = async (req: Request, res) => {
  const { authorizationCode, codeVerifier } = req.body;

  //TODO: foloseste zod aici

  if (!authorizationCode || !codeVerifier) {
    res.status(400).json({ error: 'Missing authorizationCode or codeVerifier' });
  }

  try {
    const authData = await exchangeAuthCode(authorizationCode, codeVerifier);
    await subscribeToEvents(authData.data.access_token);

    res.json(authData);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export { exchangeCode };


