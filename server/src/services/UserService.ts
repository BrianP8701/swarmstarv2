import { inject, injectable } from 'inversify'

import { Prisma, PrismaClient, User } from '@prisma/client'

import { ClerkSessionClaims } from '../utils/auth/AuthRequest'

@injectable()
export class UserService {
  constructor(@inject(PrismaClient) private prismaClient: PrismaClient) {}

  public async getOrCreateUser(sessionClaim: ClerkSessionClaims): Promise<User> {
    // Session Claim userId is the userId within Clerk, not our internal userId
    const user = await this.prismaClient.user.upsert({
      where: { id: sessionClaim.userId },
      create: {
        id: sessionClaim.userId
      },
      update: {},
    })

    return user
  }

  public async updateUserInfo(userId: string, data: Prisma.UserUpdateInput): Promise<User> {
    const user = await this.prismaClient.user.update({
      where: { id: userId },
      data,
    })

    return user
  }
}
