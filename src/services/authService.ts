import axios from "axios";
import { CONFIG } from "../config/config";

const exchangeAuthCode = async (authorizationCode: string, codeVerifier: string) => {
  try {
    console.log('Exchanging authorization code for access token...');
    //log all the data
    console.log('Kick Auth URL:', CONFIG.KICK_AUTH_URL);

    const data = {
           code: authorizationCode,
        client_id: `${CONFIG.CLIENT_ID}`,
        client_secret: `${CONFIG.CLIENT_SECRET}`,
        redirect_uri: `${CONFIG.FRONTEND_URL + '/callback'}`,
        grant_type: 'authorization_code',
        code_verifier: codeVerifier,
    };
    
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const response = await axios.post(CONFIG.KICK_AUTH_URL, data, { headers })

    console.log('Response:', response.data);
    console.log('Status:', response.status);


    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export { exchangeAuthCode };

