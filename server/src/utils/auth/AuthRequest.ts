import { User } from '@prisma/client';
import { Request } from 'express';

export interface ClerkSessionClaims {
  userId: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

interface AuthenticatedPayload {
  auth: {
    userId: string;
    sessionClaims: ClerkSessionClaims;
  } | null;
  user: User | null;
  isSuperAdmin: boolean;
}

export interface AuthenticatedRequest extends AuthenticatedPayload, Request { }

declare global {
  namespace Express {
    interface Request extends AuthenticatedPayload { }
  }
}

export { };