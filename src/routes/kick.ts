import { Router } from 'express';
import { handleWebhook } from '../controllers/hooksController';
import { exchangeCode } from '../controllers/kickControllers';
const kickRouter = Router();

kickRouter.post('/login/exchange-code', exchangeCode);
kickRouter.post('/hooks', handleWebhook);

export default kickRouter;
