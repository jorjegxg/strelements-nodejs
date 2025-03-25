import express from 'express';
import loginRouter from './login';
import { hooksRouter } from './webhooks';
const kickRouter = express.Router();

kickRouter.use('/login', loginRouter);
kickRouter.use('/hooks', hooksRouter);

export default kickRouter;
