import { Router } from 'express';
import { exchangeCode } from '../../controllers/kickControllers';
import { hooksRouter } from './webhooks';
const kickRouter = Router();

kickRouter.post('/login/exchange-code', exchangeCode);
kickRouter.use('/hooks', hooksRouter);

export default kickRouter;
