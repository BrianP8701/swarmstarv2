import { Prisma, PrismaClient, PanelNode } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { AbstractDao } from './AbstractDao'

@injectable()
export class PanelNodeDao extends AbstractDao<
  PanelNode,
  Prisma.PanelNodeCreateInput,
  Prisma.PanelNodeUpdateInput,
  Prisma.PanelNodeInclude
> {
  constructor(@inject(PrismaClient) prisma: PrismaClient) {
    super(prisma)
  }

  // CRUD methods
  async get(id: string): Promise<PanelNode> {
    return this.prisma.panelNode.findUniqueOrThrow({
      where: { id },
    })
  }

  async exists(id: string): Promise<boolean> {
    const panelLayout = await this.prisma.panelNode.findUnique({ where: { id } })
    return panelLayout !== null
  }

  async create(
    panelNodeCreateInput: Prisma.PanelNodeCreateInput,
    includeClauses?: Prisma.PanelNodeInclude
  ): Promise<PanelNode> {
    return this.prisma.panelNode.create({
      data: panelNodeCreateInput,
      include: includeClauses,
    })
  }

  async update(id: string, updateInput: Prisma.PanelNodeUpdateInput): Promise<PanelNode> {
    return this.prisma.panelNode.update({
      where: { id },
      data: updateInput,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.panelNode.delete({ where: { id } })
  }
}
