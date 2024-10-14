// formatter.ts
import {
  PanelNode as PrismaPanelNode,
  PanelContentEnum as PrismaPanelContentEnum,
  SplitDirectionEnum as PrismaSplitDirectionEnum,
  ChildPositionEnum,
} from '@prisma/client'
import {
  PanelNode as GqlPanelNode,
  PanelContentEnum as GqlPanelContentEnum,
  SplitDirectionEnum as GqlSplitDirectionEnum,
} from '../generated/graphql'

export const formatPrismaPanelNodesToGqlPanelNodes = (panelNodes: PrismaPanelNode[]): GqlPanelNode[] => {
  // Build a mapping from node IDs to PrismaPanelNode
  const nodeMap = new Map<string, PrismaPanelNode>()
  panelNodes.forEach(node => {
    nodeMap.set(node.id, node)
  })

  // Convert PrismaPanelNode to GqlPanelNode
  const gqlNodeMap = new Map<string, GqlPanelNode>()
  panelNodes.forEach(node => {
    gqlNodeMap.set(node.id, {
      id: node.id,
      content: convertPrismaContentToGqlContent(node.content),
      split: convertPrismaSplitToGqlSplit(node.split),
      parentId: node.parentId,
      firstChildId: null,
      secondChildId: null,
    })
  })

  // Set firstChildId and secondChildId
  panelNodes.forEach(node => {
    if (node.parentId && node.childPosition) {
      const parentNode = gqlNodeMap.get(node.parentId)
      if (parentNode) {
        if (node.childPosition === ChildPositionEnum.FIRST_CHILD) {
          parentNode.firstChildId = node.id
        } else if (node.childPosition === ChildPositionEnum.SECOND_CHILD) {
          parentNode.secondChildId = node.id
        }
      }
    }
  })

  // Return the list of GqlPanelNode
  return Array.from(gqlNodeMap.values())
}

// Helper functions to convert enums
const convertPrismaContentToGqlContent = (content: PrismaPanelContentEnum): GqlPanelContentEnum => {
  return content as GqlPanelContentEnum
}

const convertPrismaSplitToGqlSplit = (split: PrismaSplitDirectionEnum | null): GqlSplitDirectionEnum | null => {
  return split as GqlSplitDirectionEnum | null
}
