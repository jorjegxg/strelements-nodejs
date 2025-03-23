require('dotenv').config();
import axios from 'axios';
import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import corsMiddleware from './middleware/cors';
import kickRouter from './routes/kick';

const app = express();

app.use(corsMiddleware);
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

app.use('/kick' , kickRouter);


app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Root!' });
});

app.listen(port, () => {
  console.log(`Backend server at http://localhost:${port}`);
});
