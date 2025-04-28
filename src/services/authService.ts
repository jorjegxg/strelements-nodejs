import axios from "axios";
import z from "zod";
import { CONFIG } from "../config/config";

const authDataSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  refresh_token: z.string(),
  scope: z.string(),
  token_type: z.string(),
});
/**{
  data: [
    {
      user_id: 9537792,
      name: 'gxg_3nd',
      email: 'yotrevorgxg@gmail.com',
      profile_picture: 'https://dbxmjjzl5pc1g.cloudfront.net/68417caf-7cdd-43e3-8a65-c6d605e1b881/images/user-profile-pic.png'
    }
  ],
  message: 'OK'
} */

const usersSchema = z.object({
  data: z.array(
    z.object({
      user_id: z.number(),
      name: z.string(),
      email: z.string().email(),
      profile_picture: z.string().url()
    })
  ),
  message: z.string(),
});


type User = z.infer<typeof usersSchema>["data"][number];




const exchangeAuthCode = async (
  authorizationCode: string,
  codeVerifier: string
) => {
  const body = {
    client_id: CONFIG.CLIENT_ID,
    client_secret: CONFIG.CLIENT_SECRET,
    redirect_uri: CONFIG.FRONTEND_URL + "/callback",
    grant_type: "authorization_code",
    code_verifier: codeVerifier,
    code: authorizationCode,
  };

  try {
    const response = await axios.post(CONFIG.KICK_AUTH_URL, body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return authDataSchema.parse(response.data);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error_description ||
        "Failed to exchange authorization code" + error
    );
  }
};

// async function getUser(authorizationToken: string) {
//   try {
//     const response = await axios.post(
//       CONFIG.KICK_API_URL + "/token/introspect",
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${authorizationToken}`,
//         },
//       }
//     );

//     return userSchema.parse(response.data);
//   } catch (error: any) {
//     if (error instanceof z.ZodError) {
//       console.error("Erori Zod:", error.errors);

//       error.errors.forEach((issue) => {
//         console.error(`Eroare la ${issue.path.join(".")}: ${issue.message}`);
//       });
//     } else {
//       console.error("Altă eroare:", error);
//     }
//   }
// }



async function getCurrentUser(authorizationToken: string) : Promise<User | undefined> {
  try {
    const response = await axios.get(
      CONFIG.KICK_API_URL + "/users",
      {
        headers: {
          Authorization: `Bearer ${authorizationToken}`,
        },
      }
    );


    const users = usersSchema.parse(response.data)


    return response.data.data[0];
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      console.error("Erori Zod:", error.errors);

      error.errors.forEach((issue) => {
        console.error(`Eroare la ${issue.path.join(".")}: ${issue.message}`);
      });
    } else {
      console.error("Altă eroare:", error);
    }
  }
}

export { exchangeAuthCode, getCurrentUser as getUser };

