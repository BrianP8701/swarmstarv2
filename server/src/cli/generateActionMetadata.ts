import 'reflect-metadata'
import fs from 'fs/promises'
import path from 'path'
import { ActionEnum, ActionNode, Prisma } from '@prisma/client'
import { container } from '../utils/di/container'
import { AbstractAction } from '../swarmstar/actions/AbstractAction'
import { AbstractRouter } from '../swarmstar/actions/routers/AbstractRouter'
import { GlobalContextDao } from '../dao/GlobalContextDao'
import { logger } from '../utils/logging/logger'
import { SecretService } from '../services/SecretService'
import { ActionNodeDao } from '../dao/nodes/ActionNodeDao'
import { ActionGraphDao } from '../dao/graphs/ActionGraphDao'
import { v4 as uuidv4 } from 'uuid'
import { ActionEdgeDao } from '../dao/edges/ActionEdgeDao'
const abstractActionClassStrings = ['AbstractAction', 'AbstractRouter']

interface ActionMetadataNodeData {
  description: string
  actionEnum: ActionEnum
  parentId?: string
}

async function createActionMetadataNode(actionGraphId: string, nodeData: ActionMetadataNodeData): Promise<ActionNode> {
  const actionNodeDao = container.get(ActionNodeDao)
  const actionEdgeDao = container.get(ActionEdgeDao)
  logger.info(nodeData)

  const createInput: Prisma.ActionNodeCreateInput = {
    description: nodeData.description,
    actionEnum: nodeData.actionEnum,
    actionGraph: {
      connect: {
        id: actionGraphId,
      },
    },
  }
  const node = await actionNodeDao.create(createInput)
  if (nodeData.parentId) {
    await actionEdgeDao.create({
      startNode: {
        connect: {
          id: nodeData.parentId,
        },
      },
      endNode: {
        connect: {
          id: node.id,
        },
      },
      actionGraph: {
        connect: {
          id: actionGraphId,
        },
      },
    })
  }
  logger.info(`Created action metadata node: ${node.id}`)
  return node
}

async function loadClassFromFile(
  filePath: string,
  className: string
): Promise<typeof AbstractAction | typeof AbstractRouter> {
  const module = await import(filePath)
  return module[className]
}

async function processFolder(
  folderPath: string,
  actionGraphId: string,
  parentId: string | null = null
): Promise<ActionNode[]> {
  logger.info(`Processing folder: ${folderPath}`)
  const metadataPath = path.join(folderPath, 'metadata.json')

  try {
    await fs.access(metadataPath)
  } catch {
    logger.info(`No metadata found in: ${folderPath}`)
    return []
  }

  const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf-8'))
  metadata.parentId = parentId
  metadata.actionEnum = ActionEnum.FOLDER
  const node = await createActionMetadataNode(actionGraphId, metadata)
  const nodes = [node]
  const childrenRelationships: [ActionNode, ActionNode[]][] = []

  const items = await fs.readdir(folderPath)
  for (const item of items) {
    const itemPath = path.join(folderPath, item)
    logger.info(`Found item: ${itemPath}`)
    const stats = await fs.stat(itemPath)
    if (stats.isDirectory()) {
      logger.info(`Processing subfolder: ${itemPath}`)
      const childNodes = await processFolder(itemPath, actionGraphId, node.id)
      nodes.push(...childNodes)
      childrenRelationships.push([node, childNodes])
    } else if (item.endsWith('.ts')) {
      logger.info(`Found TypeScript file: ${itemPath}`)
      const content = await fs.readFile(itemPath, 'utf-8')
      if (
        content.includes('class') &&
        abstractActionClassStrings.some(classString => content.includes(`extends ${classString}`))
      ) {
        const className = content.split('class ')[1].split(' ')[0].trim()
        logger.info(`Found class: ${className} in ${itemPath}`)

        // Skip abstract classes
        if (content.includes('abstract class')) {
          logger.info(`Skipping abstract class: ${className}`)
          continue
        }

        try {
          const cls = await loadClassFromFile(itemPath, className)
          if (!cls) {
            logger.warn(`Failed to load class ${className} from ${itemPath}`)
            continue
          }
          logger.info(`Loaded class: ${cls.name}`)
          if (isConcreteAction(cls)) {
            logger.info(`${className} is a concrete subclass of AbstractAction or AbstractRouter`)
            const actionNode = await createActionMetadataNode(actionGraphId, {
              parentId: node.id,
              description: cls.description,
              actionEnum: cls.actionEnum,
            })
            nodes.push(actionNode)
            childrenRelationships.push([node, [actionNode]])
            logger.info(`Created action node from TypeScript file: ${actionNode.id}`)
          } else {
            logger.info(`${className} is not a concrete subclass of AbstractAction or AbstractRouter`)
          }
        } catch (e) {
          logger.error(`Error processing class ${className} from ${itemPath}:`, e)
        }
      }
    }
  }

  return nodes
}

function isConcreteAction(cls: unknown): cls is typeof AbstractAction | typeof AbstractRouter {
  return (
    typeof cls === 'function' &&
    'description' in cls &&
    'actionEnum' in cls &&
    typeof cls.description === 'string' &&
    typeof cls.actionEnum === 'string'
  )
}

export async function generateActionMetadataTree(): Promise<void> {
  const secretService = container.get(SecretService)
  const envVars = secretService.getEnvVars()
  const ACTION_FOLDER_PATH = envVars.ACTION_FOLDER_PATH
  if (!ACTION_FOLDER_PATH) {
    throw new Error('ACTION_FOLDER_PATH environment variable is not set')
  }
  const globalContextDao = container.get(GlobalContextDao)
  const actionGraphDao = container.get(ActionGraphDao)
  const actionGraph = await actionGraphDao.create({})

  // Create the default swarm first

  logger.info(`Created default action graph with ID: ${actionGraph.id}`)

  // Now process the action metadata
  const nodes = await processFolder(ACTION_FOLDER_PATH, actionGraph.id)
  logger.info(`Generated ${nodes.length} action metadata nodes`)

  await globalContextDao.create({
    rootActionNodeId: nodes[0].id,
    rootToolNodeId: uuidv4(),
    toolGraphId: uuidv4(),
    actionGraphId: actionGraph.id,
  })
}

if (require.main === module) {
  generateActionMetadataTree().catch(logger.error)
}
