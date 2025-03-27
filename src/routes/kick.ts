import { Router } from 'express';
import { handleWebhook } from '../controllers/hooksController';
import { exchangeCode } from '../controllers/kickControllers';
const kickRouter = Router();

// const exchangeCode = (req: Request, res: Response) => {
//   console.log("Eveniment Kick primit:", req.body);
//   res.status(200).send("Webhook primit cu succes");
// };


kickRouter.post('/login/exchange-code', exchangeCode);
kickRouter.post('/hooks', handleWebhook);





export default kickRouter;
