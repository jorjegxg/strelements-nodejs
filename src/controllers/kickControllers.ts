import { Request, Response } from "express";
import { exchangeAuthCode, getUser } from "../services/authService";
import { handleSubscribe } from "./hooksController";
import { subscribeToEvents } from "../services/hooksService";

const exchangeCode = async (req: Request, res: Response) => {
  const { authorizationCode, codeVerifier } = req.body;

  try {
    let authData = await exchangeAuthCode(authorizationCode, codeVerifier);

    console.log("athData", authData);
    ////////////////////
    let userData = await getUser(authData.access_token);

    /////////////////

    console.log("userData", userData);

    let response = {
      authData: authData,
      client_id: userData?.data.client_id,
    };

    //TODO: vezi daca e bine pus aici sau trebuie schimbat locul
    await subscribeToEvents(authData.access_token);

    console.log("response", response);

    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export { exchangeCode };
