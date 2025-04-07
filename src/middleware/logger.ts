import { NextFunction, Request, Response } from "express";

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`-------------------------------------------------------`);
  console.log(`Method: ${req.method} URL: ${req.url}`);
  // console.log(`Request headers: ${JSON.stringify(req.headers)}`);
  console.log(`Request body: {`);
  for (const [key, value] of Object.entries(req.body)) {
    console.log(`   ${key}: ${value}`);
  }

  console.log(`{`);

  console.log(`-------------------------------------------------------`);
  next();
};

export { requestLogger };
