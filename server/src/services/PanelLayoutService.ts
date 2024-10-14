// src/services/PanelLayoutService.ts
import { inject, injectable } from 'inversify'
import { PanelLayoutDao } from '../dao/PanelLayoutDao'
import { PanelNodeDao } from '../dao/PanelNodeDao'
import { PanelLayoutCreateInput } from '../graphql/generated/graphql'
import { ChildPositionEnum, PanelContentEnum, Prisma } from '@prisma/client'

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
    const panelNodesInput = gqlPanelLayoutCreateInput.panelNodeCreateInputs ?? []
    const rootNodeId = 'root'

    // Map of old IDs to new IDs
    const idMap = new Map<string, string>()

    // Step 1: Create all nodes without parent or childPosition
    for (const nodeInput of panelNodesInput) {
      const data = {
        panelLayout: {
          connect: {
            id: panelLayoutId,
          },
        },
        content: nodeInput.content || PanelContentEnum.EMPTY,
        split: nodeInput.split || null,
        // Do not set parent or childPosition yet
      }

      const panelNode = await this.panelNodeDao.create(data)
      idMap.set(nodeInput.id!, panelNode.id)
    }

    // Step 2: Update parent and childPosition
    for (const nodeInput of panelNodesInput) {
      const nodeId = idMap.get(nodeInput.id!)
      if (!nodeId) {
        throw new Error(`Node ID not found in idMap for nodeInput.id: ${nodeInput.id}`)
      }

      const updates: Prisma.PanelNodeUpdateInput = {}

      // Update parentId
      if (nodeInput.parentId) {
        const parentId = idMap.get(nodeInput.parentId)
        if (!parentId) {
          throw new Error(`Parent ID not found in idMap for parentId: ${nodeInput.parentId}`)
        }
        updates.parent = {
          connect: {
            id: parentId,
          },
        }
      }

      // Update childPosition
      if (nodeInput.parentId) {
        const parentNodeInput = panelNodesInput.find(n => n.id === nodeInput.parentId)
        if (parentNodeInput) {
          if (parentNodeInput.firstChildId === nodeInput.id) {
            updates.childPosition = ChildPositionEnum.FIRST_CHILD
          } else if (parentNodeInput.secondChildId === nodeInput.id) {
            updates.childPosition = ChildPositionEnum.SECOND_CHILD
          }
        }
      }

      if (Object.keys(updates).length > 0) {
        await this.panelNodeDao.update(nodeId, updates)
      }
    }

    // Update the PanelLayout with rootPanelNodeId
    const rootPanelNodeId = idMap.get(rootNodeId)
    if (!rootPanelNodeId) {
      throw new Error(`Root node ID not found in idMap for rootNodeId: ${rootNodeId}`)
    }
    await this.panelLayoutDao.update(panelLayoutId, {
      rootPanelNodeId: rootPanelNodeId,
    })
  }
}
