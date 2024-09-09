import { z } from 'zod';
import { injectable } from 'inversify';
import { logger } from '../utils/logging/logger';
import dotenv from 'dotenv';

dotenv.config();

export enum Environment {
  LOCAL = 'local',
  DEV = 'dev',
  PROD = 'prod',
}

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  GCP_PRODUCTION_PROJECT_ID: z.string(),
  MODE: z.nativeEnum(Environment),
  CLERK_WEBHOOK_SECRET: z.string(),
  CLERK_SECRET_KEY: z.string(),
  CLERK_PUBLISHABLE_KEY: z.string(),
  MY_PHONE_NUMBER: z.string(),
  TWILIO_PHONE_NUMBER: z.string(),
  TWILIO_ACCOUNT_SID: z.string(),
  TWILIO_AUTH_TOKEN: z.string(),
  OPENAI_API_KEY: z.string(),
  ACTION_FOLDER_PATH: z.string(),
  SEED_USER_ID: z.string(),
  GLOBAL_CONTEXT_ID: z.string(),
  VITE_CLERK_PUBLISHABLE_KEY: z.string(),
  VITE_GRAPHQL_URL: z.string().url(),
});

export type EnvConfig = z.infer<typeof envSchema>;

@injectable()
export class SecretService {
  private config: EnvConfig;

  constructor() {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
      logger.error('Invalid environment variables:', result.error.format());
      throw new Error('Invalid environment configuration');
    }
    this.config = result.data;
  }

  public getEnvVars(): EnvConfig {
    return this.config;
  }
}
