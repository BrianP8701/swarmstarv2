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

export const formatPrismaPanelNodesToGqlPanelNode = (panelNodes: PrismaPanelNode[]): GqlPanelNode => {
  // Build a mapping from node IDs to PrismaPanelNode
  const nodeMap = new Map<string, PrismaPanelNode>()
  panelNodes.forEach(node => {
    nodeMap.set(node.id, node)
  })

  // Build child mapping: parentId -> { FIRST_CHILD: node, SECOND_CHILD: node }
  const childrenMap = new Map<string, { FIRST_CHILD?: PrismaPanelNode; SECOND_CHILD?: PrismaPanelNode }>()
  panelNodes.forEach(node => {
    if (node.parentId) {
      if (!childrenMap.has(node.parentId)) {
        childrenMap.set(node.parentId, {})
      }
      const childMap = childrenMap.get(node.parentId)!
      if (node.childPosition === ChildPositionEnum.FIRST_CHILD) {
        childMap.FIRST_CHILD = node
      } else if (node.childPosition === ChildPositionEnum.SECOND_CHILD) {
        childMap.SECOND_CHILD = node
      }
    }
  })

  // Find the root node (node without a parent)
  const rootNodes = panelNodes.filter(node => node.parentId === null)

  if (rootNodes.length !== 1) {
    throw new Error('Expected exactly one root node')
  }

  const rootNode = rootNodes[0]

  // Recursive function to build GqlPanelNode tree
  const buildGqlPanelNode = (node: PrismaPanelNode): GqlPanelNode => {
    const childMap = childrenMap.get(node.id) || {}
    const firstChildNode = childMap.FIRST_CHILD
    const secondChildNode = childMap.SECOND_CHILD

    return {
      id: node.id,
      content: convertPrismaContentToGqlContent(node.content),
      split: convertPrismaSplitToGqlSplit(node.split),
      parentId: node.parentId || null,
      firstChild: firstChildNode ? buildGqlPanelNode(firstChildNode) : null,
      secondChild: secondChildNode ? buildGqlPanelNode(secondChildNode) : null,
    }
  }

  return buildGqlPanelNode(rootNode)
}

// Helper functions to convert enums
const convertPrismaContentToGqlContent = (content: PrismaPanelContentEnum): GqlPanelContentEnum => {
  return content as GqlPanelContentEnum
}

const convertPrismaSplitToGqlSplit = (split: PrismaSplitDirectionEnum | null): GqlSplitDirectionEnum | null => {
  return split as GqlSplitDirectionEnum | null
}
