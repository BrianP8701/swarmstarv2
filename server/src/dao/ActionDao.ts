import { ActionNode, Prisma, PrismaClient, ActionEnum } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { ActionContextSchemaMap } from '../constants/actionConstants'
import { ZodError } from 'zod'

@injectable()
export class ActionDao {
  constructor(@inject(PrismaClient) private prisma: PrismaClient) { }

  async log(actionId: string, messages: string[]) {
    return this.prisma.actionNode.update({
      where: { id: actionId },
      data: { logs: { push: messages } },
    })
  }

  async create(actionCreateInput: Prisma.ActionNodeCreateInput): Promise<ActionNode> {
    this.assertContextType(actionCreateInput.actionEnum, actionCreateInput.context as any);
    return this.prisma.actionNode.create({
      data: actionCreateInput,
    })
  }

  async update(actionId: string, actionEnum: ActionEnum, actionUpdateInput: Prisma.ActionNodeUpdateInput): Promise<ActionNode> {
    if (actionUpdateInput.context) {
      this.assertContextType(actionEnum, actionUpdateInput.context);
    }

    return this.prisma.actionNode.update({
      where: { id: actionId },
      data: actionUpdateInput,
    })
  }

  private assertContextType(actionEnum: ActionEnum, context: any) {
    const schema = ActionContextSchemaMap[actionEnum];
    try {
      schema.parse(context);
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
        throw new Error(`Invalid context for action type ${actionEnum}: ${errorMessages}`);
      }
      throw error;
    }
  }
}
