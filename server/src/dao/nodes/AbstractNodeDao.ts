import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';

@injectable()
export abstract class AbstractNodeDao<TNode, TParent> {
  constructor(@inject(PrismaClient) protected prisma: PrismaClient) { }

  abstract exists(id: string): Promise<boolean>;
  abstract getChildren(nodeId: string): Promise<TNode[]>;
  abstract getParent(nodeId: string): Promise<TParent | null>;
}
