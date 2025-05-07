import cors from "cors";
import { CONFIG } from "../config/config";
//TODO: change in production

const corsOptions = {
  // origin: [CONFIG.FRONTEND_URL, CONFIG.FRONTEND_URL2, CONFIG.FRONTEND_URL3],
  // methods: ["GET", "POST", "PUT", "DELETE"],
  // allowedHeaders: ["Content-Type", "Authorization"],
};

console.log("Cors -----------------------------------: ", CONFIG.FRONTEND_URL);

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
