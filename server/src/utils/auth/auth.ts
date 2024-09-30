import { NextFunction, Response } from 'express'
import { container } from '../di/container'
import { UserService } from '../../services/UserService'
import { AuthenticatedRequest } from './AuthRequest'
import { logger } from '../logging/logger'
import { SecretService } from '../../services/SecretService'

export const checkAuthenticated = async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  try {
    const secretService = container.get(SecretService)
    const isEnvLocal = secretService.getEnvVars().MODE === 'local'
    if (!isEnvLocal) {
      logger.info('Authenticating user: ', JSON.stringify(req.auth, null, 2))
    }
    const sessionClaim = req.auth?.sessionClaims
    if (sessionClaim) {
      const user = await container.get(UserService).getOrCreateUser(sessionClaim)
      req.user = user
    }
  } catch (e) {
    logger.error('Unexpected authentication error', { cause: e })
  }
  next()
}
