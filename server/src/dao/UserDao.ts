import { Prisma, PrismaClient } from '@prisma/client'
import { inject, injectable } from 'inversify'

@injectable()
export class UserDao {
  constructor(@inject(PrismaClient) private prisma: PrismaClient) {}

  async createUser(userCreateInput: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data: userCreateInput,
    })
  }
}
