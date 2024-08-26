import { Prisma, PrismaClient } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { generateId } from '../utils/ids'

@injectable()
export class OperationDao {
  constructor(@inject(PrismaClient) private prisma: PrismaClient) {}

  // FunctionCallOperation methods
  async createFunctionCallOperation(swarmId: string, createInput: Omit<Prisma.FunctionCallOperationCreateInput, 'id'>) {
    const id = await generateId('FunctionCallOperation', swarmId)
    return this.prisma.functionCallOperation.create({
      data: { ...createInput, id },
    })
  }

  async updateFunctionCallOperation(id: string, updateInput: Prisma.FunctionCallOperationUpdateInput) {
    return this.prisma.functionCallOperation.update({
      where: { id },
      data: updateInput,
    })
  }

  async getFunctionCallOperation(id: string) {
    return this.prisma.functionCallOperation.findUnique({
      where: { id },
    })
  }

  // TerminationOperation methods
  async createTerminationOperation(swarmId: string, createInput: Omit<Prisma.TerminationOperationCreateInput, 'id'>) {
    const id = await generateId('TerminationOperation', swarmId)
    return this.prisma.terminationOperation.create({
      data: { ...createInput, id },
    })
  }

  async updateTerminationOperation(id: string, updateInput: Prisma.TerminationOperationUpdateInput) {
    return this.prisma.terminationOperation.update({
      where: { id },
      data: updateInput,
    })
  }

  async getTerminationOperation(id: string) {
    return this.prisma.terminationOperation.findUnique({
      where: { id },
    })
  }

  // BlockingOperation methods
  async createBlockingOperation(swarmId: string, createInput: Omit<Prisma.BlockingOperationCreateInput, 'id'>) {
    const id = await generateId('BlockingOperation', swarmId);
    return this.prisma.blockingOperation.create({
      data: { ...createInput, id },
    });
  }

  async updateBlockingOperation(id: string, updateInput: Prisma.BlockingOperationUpdateInput) {
    return this.prisma.blockingOperation.update({
      where: { id },
      data: updateInput,
    })
  }
}
