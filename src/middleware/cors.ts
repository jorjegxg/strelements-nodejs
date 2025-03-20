import cors from 'cors';

const corsOptions = {
  origin: [`${process.env.FRONTEND_LOCAL_URL!}`, `${process.env.FRONTEND_URL!}`],

  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
