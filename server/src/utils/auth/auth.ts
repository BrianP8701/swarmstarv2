import { NextFunction, Response } from 'express';
import { container } from '../di/container';
import { UserService } from '../../services/UserService';
import { AuthenticatedRequest } from './AuthRequest';
import { logger } from '../logging/logger';

export const checkAuthenticated = async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  try {
    const sessionClaim = req.auth?.sessionClaims;
    if (sessionClaim) {
      const user = await container.get(UserService).getOrCreateUser(sessionClaim);
      req.user = user;
    }
  } catch (e) {
    logger.error('Unexpected authentication error', { cause: e });
  }
  next();
};
