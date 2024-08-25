import { Prisma, PrismaClient } from '@prisma/client'
import assert from 'assert'
import { inject, injectable } from 'inversify'

@injectable()
export class SwarmDao {
  constructor(@inject(PrismaClient) private prisma: PrismaClient) { }

  async createSwarm(swarmCreateInput: Prisma.SwarmCreateInput) {
    return this.prisma.swarm.create({
      data: swarmCreateInput,
    })
  }

  async updateSwarm(
    swarmId: string,
    swarmUpdateInput: Prisma.SwarmUpdateInput
  ) {
    return this.prisma.swarm.update({
      where: { id: swarmId },
      data: swarmUpdateInput,
    })
  }

  async getSwarmObjectCount(
    swarmId: string, 
    countColumnName: Prisma.SwarmScalarFieldEnum,
    tx?: Prisma.TransactionClient
  ): Promise<number> {
    const client = tx || this.prisma
    const result = await client.swarm.findUniqueOrThrow({
      where: { id: swarmId },
    })

    assert(typeof result[countColumnName] === 'number', `countColumnName ${countColumnName} not found in swarm ${swarmId}`)
    return result[countColumnName] ?? 0
  }
  
  async getAndIncrementSwarmObjectCount(swarmId: string, countColumnName: Prisma.SwarmScalarFieldEnum): Promise<number> {
    return this.prisma.$transaction(async (tx) => {
      const currentCount = await this.getSwarmObjectCount(swarmId, countColumnName, tx)
  
      await tx.swarm.update({
        where: { id: swarmId },
        data: { [countColumnName]: { increment: 1 } },
      })
  
      return currentCount + 1
    })
  }
}
