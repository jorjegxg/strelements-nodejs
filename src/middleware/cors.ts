import cors from 'cors';
//TODO: change in production

const corsOptions = {
  origin: `${process.env.FRONTEND_URL!}`,

  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const corsMiddleware = cors(corsOptions);


export default corsMiddleware;
