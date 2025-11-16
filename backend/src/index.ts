import express, { Request, Response } from 'express';
import cors from 'cors';
import apiRoutes from './routes';
import { errorHandler } from './middlewares/error-middleware';
import logger from './utils/logger';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/api', apiRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Backend server running on http://localhost:${PORT}`);
});
