import { Request, Response } from "express";

import http from 'http';

import express from 'express';



const app = express();
const server = http.createServer(app);

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});


server.listen(3000, () => {
  console.log('Serverul rulează pe portul 3000');
});