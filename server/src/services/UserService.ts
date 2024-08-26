import { inject, injectable } from 'inversify'

import { PrismaClient, User } from '@prisma/client'

import { ClerkSessionClaims } from '../utils/auth/AuthRequest'

@injectable()
export class UserService {
  constructor(@inject(PrismaClient) private prismaClient: PrismaClient) {}

  public async getOrCreateUser(sessionClaim: ClerkSessionClaims): Promise<User> {
    // Session Claim userId is the userId within Clerk, not our internal userId
    const user = await this.prismaClient.user.upsert({
      where: { clerkId: sessionClaim.sub },
      create: {
        clerkId: sessionClaim.sub
      },
      update: {},
    })

    return user
  }
}
