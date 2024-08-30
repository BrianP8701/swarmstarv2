import { User } from '@prisma/client';
import { Request } from 'express';

export interface ClerkSessionClaims {
  azp: string;
  exp: number;
  iat: number;
  iss: string;
  nbf: number;
  sid: string;
  sub: string;
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
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Request extends AuthenticatedPayload { }
  }
}

export { };
