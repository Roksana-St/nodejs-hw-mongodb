import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import contactsRouter from './routes/contacts.js';
import authRouter from './routes/auth.js'; 
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';



export const setupServer = () => {
  const app = express();
  const logger = pino();
app.use(cookieParser());

  app.use(cors());
  app.use(cors({
  origin: process.env.APP_DOMAIN,
  credentials: true, 
}));
  app.use(express.json());
  app.use(pinoHttp({ logger }));

  app.use('/contacts', contactsRouter);
  
  app.use('/auth', authRouter); 

  app.use(notFoundHandler);
  app.use(errorHandler);





  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
};

export default setupServer;
