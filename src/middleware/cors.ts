import cors from "cors";
import { CONFIG } from "../config/config";
//TODO: change in production

const corsOptions = {
  origin: [
    `${CONFIG.FRONTEND_URL!}`,
    `${CONFIG.FRONTEND_LOCAL_URL!}`,
  ],

  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
