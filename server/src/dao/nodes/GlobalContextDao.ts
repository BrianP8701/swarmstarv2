import { GlobalContext, Prisma, PrismaClient } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { SecretService } from '../../services/SecretService';

@injectable()
export class GlobalContextDao {
  constructor(
    @inject(PrismaClient) private prisma: PrismaClient,
    @inject(SecretService) private secretService: SecretService
  ) { }

  

  public async getDefaultSwarmId(): Promise<string> {
    const globalContext = await this.prisma.globalContext.findUniqueOrThrow({
      where: {
        id: this.secretService.getGlobalContextId(),
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
