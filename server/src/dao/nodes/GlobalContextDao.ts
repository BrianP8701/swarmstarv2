import { GlobalContext, Prisma, PrismaClient } from '@prisma/client'
import { inject, injectable } from 'inversify'

@injectable()
export class GlobalContextDao {
  constructor(@inject(PrismaClient) private prisma: PrismaClient) { }

  

  public async getDefaultSwarmId(): Promise<string> {
    const globalContext = await this.prisma.globalContext.findUniqueOrThrow({
      where: {
        id: process.env.GLOBAL_CONTEXT_ID,
      },
    })
    return globalContext.defaultSwarmId
  }

  public async upsertGlobalContext(globalContext: Prisma.GlobalContextCreateInput): Promise<GlobalContext> {
    return this.prisma.globalContext.upsert({
      where: {
        id: globalContext.id,
      },
      update: globalContext,
      create: globalContext,
    })
  }
}
