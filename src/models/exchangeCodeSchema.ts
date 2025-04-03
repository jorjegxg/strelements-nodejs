import { z } from "zod";

const exchangeCodeSchema = z.object({
  authorizationCode: z.string().min(1, "Missing authorizationCode"),
  codeVerifier: z.string().min(1, "Missing codeVerifier"),
});

export { exchangeCodeSchema };
