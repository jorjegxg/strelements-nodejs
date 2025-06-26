import { Request, Response } from "express";

export const oAuthCallback = async (req: Request, res: Response) => {
  try {
    console.log("req.body--------------------", req.body);

    // 1.validare date
    // const parsedBody = exchangeCodeSchema.safeParse(req.body);
    // if (!parsedBody.success) {
    //   res.status(400).json({
    //     error: "Invalid request body",
    //     details: parsedBody.error.errors,
    //   });
    // }
    // // 2.apelare service cu datele validate
    // const { authorizationCode, codeVerifier } = req.body;
    // let response = await loginWithKick(authorizationCode, codeVerifier);
    // console.log("response ------------------------ ", response);
    // 3.returnare succes
    res.status(200).json({});
  } catch (error: any) {
    // 4.1 returnare eroare api
    // console.error("❌ Error:", error);
    // // 4.2 Returnare orice alta eroare
    // if (error instanceof ApiError) {
    //   res.status(error.statusCode).json({ error: error.message });
    // }
    res.status(500).send(error.message);
  }
};
// export const oAuthCallback = async (req: Request, res: Response) => {
//   try {
//     // 1.validare date
//     // const parsedBody = exchangeCodeSchema.safeParse(req.body);
//     // if (!parsedBody.success) {
//     //   res.status(400).json({
//     //     error: "Invalid request body",
//     //     details: parsedBody.error.errors,
//     //   });
//     // }
//     // // 2.apelare service cu datele validate
//     // const { authorizationCode, codeVerifier } = req.body;
//     // let response = await loginWithKick(authorizationCode, codeVerifier);
//     // console.log("response ------------------------ ", response);
//     // 3.returnare succes
//     res.status(200).json({});
//   } catch (error: any) {
//     // 4.1 returnare eroare api
//     // console.error("❌ Error:", error);
//     // // 4.2 Returnare orice alta eroare
//     // if (error instanceof ApiError) {
//     //   res.status(error.statusCode).json({ error: error.message });
//     // }
//     res.status(500).send(error.message);
//   }
// };
