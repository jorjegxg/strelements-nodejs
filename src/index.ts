require('dotenv').config();
import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import listEndpoints from 'express-list-endpoints';
import { handleSubscribe } from './controllers/hooksController';
import corsMiddleware from './middleware/cors';
import { requestLogger } from './middleware/logger';
import { validateRequest } from './middleware/validation';
import { toggleRequestBodySchema } from './models/toogleRequestSchema';
import kickRouter from './routes/kick';

const app = express();

//middleware for logging
app.use(requestLogger);


app.use(corsMiddleware);
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

app.use('/kick', kickRouter);

app.use(requestLogger);
console.log(listEndpoints(app));

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Root!' });
});

app.listen(port, () => {
  console.log(`Backend server at http://localhost:${port}`);
});


app.post('/toggle', validateRequest(toggleRequestBodySchema), handleSubscribe,);


