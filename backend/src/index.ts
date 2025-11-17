import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRoutes from './routes';
import { errorHandler } from './middlewares/error-middleware';
import { requestMiddleware } from './middlewares/request-middleware';
import logger from './utils/logger';
import { isProd } from './config/isProd';
import { APP_PORT, FE_URL } from './config/app';

const app = express();
const PORT = APP_PORT;

app.use(
  cors({
    origin: isProd
      ? [FE_URL]
      : ['http://localhost:3001', 'http://localhost:3000'],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(requestMiddleware);

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/api', apiRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Backend server running on http://localhost:${PORT}`);
});
