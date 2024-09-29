import { GlobalContext, Prisma, PrismaClient } from '@prisma/client'
import { inject, injectable } from 'inversify'

@injectable()
export class GlobalContextDao {
  constructor(
    @inject(PrismaClient) private prisma: PrismaClient
  ) {}

  public async get(): Promise<GlobalContext> {
    const globalContext = await this.prisma.globalContext.findFirst()
    if (!globalContext) {
      throw new Error('Global context not found')
    }
    return globalContext
  }

  public async create(globalContext: Prisma.GlobalContextCreateInput): Promise<GlobalContext> {
    return this.prisma.globalContext.create({
      data: globalContext,
    })
  }
}
