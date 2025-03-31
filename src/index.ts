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
import { subscribeToEvents } from './services/hooksService';

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

app.post('/toggle', async (req: Request, res: Response) => {

  const { isActive, accessToken } = req.body;

  if (isActive === undefined) {
    res.status(400).json({ message: 'Missing required parameter(isActive)' });
    return;
  }

  if (accessToken === undefined) {
    res.status(400).json({ message: 'Missing required parameter(accessToken)' });
    return;
  }

  console.log('Received isActive:', isActive);
  console.log('Received accessToken:', accessToken);


  ///////////////

  try {
    const response = await subscribeToEvents(accessToken);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: "Error subscribing to events" });
  }
  ///////////////
});




app.post('/toggle', validateRequest(toggleRequestBodySchema), handleSubscribe,);


