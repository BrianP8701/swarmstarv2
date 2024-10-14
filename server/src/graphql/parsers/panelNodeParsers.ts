// formatter.ts
import {
  PanelNodeCreateInput as GqlPanelNodeCreateInput,
  PanelContentEnum as GqlPanelContentEnum,
  SplitDirectionEnum as GqlSplitDirectionEnum,
} from '../generated/graphql'
import {
  PanelContentEnum as PrismaPanelContentEnum,
  SplitDirectionEnum as PrismaSplitDirectionEnum,
  ChildPositionEnum,
  Prisma,
} from '@prisma/client'

export const flattenGqlPanelNodeCreateInput = (
  node: GqlPanelNodeCreateInput,
  panelLayoutId: string,
  parentId: string | null = null,
  childPosition: ChildPositionEnum | null = null
): Prisma.PanelNodeCreateInput[] => {
  const nodes: Prisma.PanelNodeCreateInput[] = []

  const nodeId = node.id || generateUniqueId()

  const prismaNode: Prisma.PanelNodeCreateInput = {
    id: nodeId,
    panelLayout: {
      connect: {
        id: panelLayoutId,
      },
    },
    content: convertGqlContentToPrismaContent(node.content) || PrismaPanelContentEnum.EMPTY,
    split: convertGqlSplitToPrismaSplit(node.split),
    parent: parentId
      ? {
          connect: {
            id: parentId,
          },
        }
      : undefined,
    childPosition: childPosition || null,
  }

  nodes.push(prismaNode)

  if (node.firstChild) {
    const firstChildNodes = flattenGqlPanelNodeCreateInput(
      node.firstChild,
      panelLayoutId,
      nodeId,
      ChildPositionEnum.FIRST_CHILD
    )
    nodes.push(...firstChildNodes)
  }

  if (node.secondChild) {
    const secondChildNodes = flattenGqlPanelNodeCreateInput(
      node.secondChild,
      panelLayoutId,
      nodeId,
      ChildPositionEnum.SECOND_CHILD
    )
    nodes.push(...secondChildNodes)
  }

  return nodes
}

// Helper functions to convert enums
const convertGqlContentToPrismaContent = (content?: GqlPanelContentEnum | null): PrismaPanelContentEnum | null => {
  return content as PrismaPanelContentEnum | null
}

const convertGqlSplitToPrismaSplit = (split?: GqlSplitDirectionEnum | null): PrismaSplitDirectionEnum | null => {
  return split as PrismaSplitDirectionEnum | null
}

// Utility function to generate unique IDs if not provided
const generateUniqueId = (): string => {
  // Implement your unique ID generation logic here (e.g., UUID)
  return 'generated-unique-id'
}
