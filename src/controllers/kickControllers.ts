import { Request, Response } from "express";
import { exchangeAuthCode, getUser as getCurrentUser } from "../services/authService";
import { subscribeToEvents } from "../services/hooksService";




const exchangeCode = async (req: Request, res: Response) => {
  const { authorizationCode, codeVerifier } = req.body;

  try {
    let authData = await exchangeAuthCode(authorizationCode, codeVerifier);

    const [_,currentUser] = await Promise.all([
      subscribeToEvents(authData.access_token),
      getCurrentUser(authData.access_token),
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
};

export { exchangeCode };

