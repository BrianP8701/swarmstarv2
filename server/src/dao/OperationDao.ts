import { Operation, Prisma, PrismaClient } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { AbstractDao } from './AbstractDao'

@injectable()
export class OperationDao extends AbstractDao<Operation, Prisma.OperationCreateInput, Prisma.OperationUpdateInput, Prisma.OperationInclude> {
  constructor(@inject(PrismaClient) prisma: PrismaClient) {
    super(prisma);
  }

  // CRUD methods
  async get(id: string): Promise<Operation> {
    return this.prisma.operation.findUniqueOrThrow({
      where: { id },
    })
  }

  async exists(id: string): Promise<boolean> {
    const operation = await this.prisma.operation.findUnique({ where: { id } });
    return operation !== null;
  }

  async create(createInput: Prisma.OperationCreateInput, includeClauses?: Prisma.OperationInclude): Promise<Operation> {
    return this.prisma.operation.create({
      data: createInput,
      include: includeClauses
    })
  }

  async update(id: string, updateInput: Prisma.OperationUpdateInput): Promise<Operation> {
    return this.prisma.operation.update({
      where: { id },
      data: updateInput,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.operation.delete({ where: { id } });
  }

  // Additional methods can be added here if needed
}
