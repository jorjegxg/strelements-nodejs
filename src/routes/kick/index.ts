import express from 'express';
import hooksRouter from './webhooks';
import loginRouter from './login';
const kickRouter = express.Router();

kickRouter.use('/login', loginRouter);
kickRouter.use('/hooks', hooksRouter);

export default kickRouter;

// /login/exchange-code
// /hooks/events/subscriptions
// /hooks/webhook