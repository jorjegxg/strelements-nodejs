import express, { Request, Response } from 'express';
import { handleWebhook } from '../controllers/hooksController';
import { exchangeCode } from '../controllers/kickControllers';
// import { exchangeCode } from '../controllers/kickControllers';
const kickRouter: express.Router = express.Router();

// middleware that is specific to this router
const timeLog = (req: Request, res: Response, next: express.NextFunction) => {
  console.log('-----------------------');
  console.log('Time: ', Date.now())
  console.log('Request URL:', req.originalUrl);
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
  console.log('Request params:', req.params);
  console.log('Request query:', req.query);
  console.log('-----------------------');
  next()
}

kickRouter.use(timeLog)


kickRouter.post('/login/exchange-code', exchangeCode);
kickRouter.post('/hooks', handleWebhook);


export default kickRouter;
