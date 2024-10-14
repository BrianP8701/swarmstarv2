import { Prisma, PrismaClient, PanelLayout, PanelNode } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { AbstractDao } from './AbstractDao'

@injectable()
export class PanelLayoutDao extends AbstractDao<
  PanelLayout,
  Prisma.PanelLayoutCreateInput,
  Prisma.PanelLayoutUpdateInput,
  Prisma.PanelLayoutInclude
> {
  constructor(@inject(PrismaClient) prisma: PrismaClient) {
    super(prisma)
  }

  // CRUD methods
  async get(id: string): Promise<PanelLayout> {
    return this.prisma.panelLayout.findUniqueOrThrow({
      where: { id },
    })
  }

  async exists(id: string): Promise<boolean> {
    const panelLayout = await this.prisma.panelLayout.findUnique({ where: { id } })
    return panelLayout !== null
  }

  async create(
    panelLayoutCreateInput: Prisma.PanelLayoutCreateInput,
    includeClauses?: Prisma.PanelLayoutInclude
  ): Promise<PanelLayout> {
    return this.prisma.panelLayout.create({
      data: panelLayoutCreateInput,
      include: includeClauses,
    })
  }

  async update(id: string, updateInput: Prisma.PanelLayoutUpdateInput): Promise<PanelLayout> {
    return this.prisma.panelLayout.update({
      where: { id },
      data: updateInput,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.panelLayout.delete({ where: { id } })
  }

  async getPanelNodes(id: string): Promise<PanelNode[]> {
    const panelLayout = await this.prisma.panelLayout.findUniqueOrThrow({
      where: { id },
      select: { panelNodes: true },
    })
    return panelLayout.panelNodes
  }

  async updatePanelLayoutLastUsed(userId: string, panelLayoutId: string): Promise<void> {
    await this.prisma.userToPanelLayoutMapping.update({
      where: { userId_panelLayoutId: { userId, panelLayoutId } },
      data: { lastUsed: new Date() },
    })
  }
}
