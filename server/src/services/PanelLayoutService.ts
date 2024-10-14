import { inject, injectable } from 'inversify'
import { PanelLayoutDao } from '../dao/PanelLayoutDao'
import { PanelLayoutCreateInput, PanelNodeCreateInput } from '../graphql/generated/graphql'
import { PanelNodeDao } from '../dao/PanelNodeDao'
import { ChildPositionEnum } from '@prisma/client'

@injectable()
export class PanelLayoutService {
  constructor(
    @inject(PanelLayoutDao) private panelLayoutDao: PanelLayoutDao,
    @inject(PanelNodeDao) private panelNodeDao: PanelNodeDao
  ) {}

  public async createPanelLayout(userId: string, gqlPanelLayoutCreateInput: PanelLayoutCreateInput): Promise<void> {
    // Create the PanelLayout
    const panelLayout = await this.panelLayoutDao.create({
      isEditable: true,
      userToPanelLayoutMappings: {
        create: {
          userId: userId,
        },
      },
    })

    const panelLayoutId = panelLayout.id

    // Process the root node
    const panelNodeCreateInputs = gqlPanelLayoutCreateInput.panelNodeCreateInputs

    if (panelNodeCreateInputs?.length !== 1) {
      throw new Error('Exactly one root PanelNode is required.')
    }

    const rootPanelNodeInput = panelNodeCreateInputs[0]

    const rootPanelNodeId = await this.createPanelNodesRecursively(rootPanelNodeInput, panelLayoutId, null, null)

    // Update the PanelLayout with rootPanelNodeId
    await this.panelLayoutDao.update(panelLayoutId, { rootPanelNodeId: rootPanelNodeId })
  }

  private async createPanelNodesRecursively(
    gqlPanelNodeCreateInput: PanelNodeCreateInput,
    panelLayoutId: string,
    parentId: string | null,
    childPosition: ChildPositionEnum | null
  ): Promise<string> {
    const panelNode = await this.panelNodeDao.create({
      panelLayout: {
        connect: {
          id: panelLayoutId,
        },
      },
      content: gqlPanelNodeCreateInput.content || 'EMPTY',
      split: gqlPanelNodeCreateInput.split || null,
      parent: parentId
        ? {
            connect: {
              id: parentId,
            },
          }
        : undefined,
      childPosition: childPosition,
    })

    const panelNodeId = panelNode.id

    // Recursively process children
    if (gqlPanelNodeCreateInput.firstChild) {
      await this.createPanelNodesRecursively(
        gqlPanelNodeCreateInput.firstChild,
        panelLayoutId,
        panelNodeId,
        ChildPositionEnum.FIRST_CHILD
      )
    }

    if (gqlPanelNodeCreateInput.secondChild) {
      await this.createPanelNodesRecursively(
        gqlPanelNodeCreateInput.secondChild,
        panelLayoutId,
        panelNodeId,
        ChildPositionEnum.SECOND_CHILD
      )
    }

    return panelNodeId
  }
}
