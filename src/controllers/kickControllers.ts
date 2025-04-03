import { Request, Response } from "express";
import { exchangeAuthCode } from "../services/authService";

const exchangeCode = async (req: Request, res: Response) => {
  const { authorizationCode, codeVerifier } = req.body;

  try {
    const authData = await exchangeAuthCode(authorizationCode, codeVerifier);
    res.status(200).json(authData);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export { exchangeCode };
