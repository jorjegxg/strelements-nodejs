/**import { Request, Response } from "express";
import { authService } from "./auth.service";

export const authController = {
  register: async (req: Request, res: Response) => {
    const { email, username, password } = req.body;
    const result = await authService.register(email, username, password);
    res.status(201).json(result);
  },

  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json(result);
  },
};
 */
import { Request, Response } from "express";
import { subscribeToEvents } from "../../services/hooksService";
import { authService } from "./kick.service";

export const kickController = {
 exchangeCode : async (req: Request, res: Response) => {
  const { authorizationCode, codeVerifier } = req.body;

  try {
    let authData = await authService.exchangeAuthCode(authorizationCode, codeVerifier);

    const [_,currentUser] = await Promise.all([
      subscribeToEvents(authData.access_token),
      authService.getCurrentUser(authData.access_token),
    ]);

    let response = {
      authData: authData,
      user: currentUser,
    };

    console.log("response 21542jkihn ----------:", response);


    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}
};
