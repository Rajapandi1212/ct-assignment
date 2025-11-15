import express, { Request, Response } from 'express';
import cors from 'cors';
import { User } from '../../types';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.get('/api/users', (_req: Request, res: Response) => {
  const users: User[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
  ];
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
