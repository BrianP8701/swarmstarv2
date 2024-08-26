import { Prisma, PrismaClient } from '@prisma/client'
import { inject, injectable } from 'inversify'

@injectable()
export class OperationDao {
  constructor(@inject(PrismaClient) private prisma: PrismaClient) {}

  // FunctionCallOperation methods
  async createFunctionCallOperation(createInput: Prisma.FunctionCallOperationCreateInput) {
    return this.prisma.functionCallOperation.create({
      data: createInput
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
  async createTerminationOperation(createInput: Prisma.TerminationOperationCreateInput) {
    return this.prisma.terminationOperation.create({
      data: createInput
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
  async createBlockingOperation(createInput: Prisma.BlockingOperationCreateInput) {
    return this.prisma.blockingOperation.create({
      data: createInput
    });
  }

  async updateBlockingOperation(id: string, updateInput: Prisma.BlockingOperationUpdateInput) {
    return this.prisma.blockingOperation.update({
      where: { id },
      data: updateInput,
    })
  }
}
