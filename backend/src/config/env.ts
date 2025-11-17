import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('8080'),

  CTP_CLIENT_ID: z.string(),
  CTP_CLIENT_SECRET: z.string(),
  CTP_PROJECT_KEY: z.string(),
  CTP_AUTH_URL: z.string().url(),
  CTP_API_URL: z.string().url(),
  CTP_SCOPES: z.string(),
  JWT_SECRET_KEY: z.string(),
  SESSION_KEY: z.string(),
  SESSION_EXPIRE_TIME: z.string().default('60'), // minutes
  ENVIRONMENT: z.enum(['prod', 'dev']).default('prod'),
  FE_URL: z.string().url(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid ENV configuration');
  console.error(parsed.error.issues);
  process.exit(1);
}

export const ENV = parsed.data;
