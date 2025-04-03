import { NextFunction, Request, Response } from "express";

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`-------------------------------------------------------`);
  console.log(`Method: ${req.method} URL: ${req.url}`);
  // console.log(`Request headers: ${JSON.stringify(req.headers)}`);
  console.log(`Request body: ${JSON.stringify(req.body)}`);
  console.log(`-------------------------------------------------------`);
  next();
};

export { requestLogger };
