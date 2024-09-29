import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';

@injectable()
export abstract class AbstractDao<
  TEntity,
  TCreateInput,
  TUpdateInput,
  TIncludeClauses
> {
  constructor(@inject(PrismaClient) protected prisma: PrismaClient) {}

  abstract get(id: string): Promise<TEntity>;
  abstract exists(id: string): Promise<boolean>;
  abstract create(createInput: TCreateInput, includeClauses?: TIncludeClauses): Promise<TEntity>;
  abstract update(id: string, updateInput: TUpdateInput): Promise<TEntity>;
  abstract delete(id: string): Promise<void>;
}
