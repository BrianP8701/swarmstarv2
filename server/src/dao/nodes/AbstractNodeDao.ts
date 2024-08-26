import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';

type PrismaModelWithParent = {
  findMany: (args: { where: { parentId: string } }) => Promise<any[]>;
  findUnique: (args: { where: { id: string }; include?: { parent: true } }) => Promise<any>;
};

@injectable()
export abstract class AbstractNodeDao<
  T,
  M extends PrismaModelWithParent
> {
  constructor(@inject(PrismaClient) protected prisma: PrismaClient) { }

  abstract get model(): M;

  async exists(id: string): Promise<boolean> {
    const node = await this.model.findUnique({
      where: { id }
    });
    return node !== null;
  }

  async getChildren(nodeId: string): Promise<T[]> {
    return this.model.findMany({
      where: { parentId: nodeId }
    }) as Promise<T[]>;
  }

  async getParent(nodeId: string): Promise<T | null> {
    const node = await this.model.findUnique({
      where: { id: nodeId },
      include: { parent: true }
    });
    return (node?.parent as T) || null;
  }
}
