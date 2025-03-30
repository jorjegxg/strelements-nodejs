import { NextFunction, Request, Response } from 'express';
import { z, ZodSchema } from 'zod';

function validateRequest(bodySchema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      bodySchema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
      } else {
        res.status(500).json({ error: 'Body validation failed' });
      }
    }
  };
}



export { validateRequest };

