import axios from "axios";
import { CONFIG } from "../config/config";

async function exchangeAuthCode(authorizationCode: string, codeVerifier: string) {

  const params = new URLSearchParams({
    code: authorizationCode,
    client_id: CONFIG.CLIENT_ID,
    client_secret: CONFIG.CLIENT_SECRET,
    redirect_uri: CONFIG.FRONTEND_URL + '/callback',
    grant_type: 'authorization_code',
    code_verifier: codeVerifier,
  });


  try {
    console.log('Received authorization code:', authorizationCode);

    const response = await axios.post(CONFIG.KICK_AUTH_URL, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });


    console.log('Received auth data:', response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error_description || 'Failed to exchange authorization code');
  }
}

export { exchangeAuthCode };

