import 'reflect-metadata';
import fs from 'fs/promises';
import path from 'path';
import { ActionEnum, ActionMetadataNode, Prisma } from '@prisma/client';
import { container } from '../utils/di/container';
import { ActionMetadataNodeDao } from '../dao/nodes/ActionMetadataDao';
import { AbstractAction } from '../swarmstar/actions/AbstractAction';
import { AbstractRouter } from '../swarmstar/actions/routers/AbstractRouter';
import { GlobalContextDao } from '../dao/nodes/GlobalContextDao';
import { SwarmDao } from '../dao/SwarmDao';
import { logger } from '../utils/logging/logger';
import { SecretService } from '../services/SecretService';

const abstractActionClassStrings = ["AbstractAction", "AbstractRouter"]

interface ActionMetadataNodeData {
  description: string;
  actionEnum: ActionEnum;
  parentId?: string;
}

async function createActionMetadataNode(swarmId: string, nodeData: ActionMetadataNodeData): Promise<ActionMetadataNode> {
  const actionMetadataNodeDao = container.get(ActionMetadataNodeDao);
  logger.info(nodeData);

  const createInput: Prisma.ActionMetadataNodeCreateInput = {
    description: nodeData.description,
    actionEnum: nodeData.actionEnum,
    swarm: { connect: { id: swarmId } }
  };
  if (nodeData.parentId) {
    createInput.parent = { connect: { id: nodeData.parentId } };
  }
  const node = await actionMetadataNodeDao.create(createInput);
  logger.info(`Created action metadata node: ${node.id}`);
  return node;
}

async function loadClassFromFile(filePath: string, className: string): Promise<typeof AbstractAction | typeof AbstractRouter> {
  const module = await import(filePath);
  return module[className];
}

async function processFolder(folderPath: string, swarmId: string, parentId: string | null = null): Promise<ActionMetadataNode[]> {
  logger.info(`Processing folder: ${folderPath}`);
  const metadataPath = path.join(folderPath, 'metadata.json');

  try {
    await fs.access(metadataPath);
  } catch {
    logger.info(`No metadata found in: ${folderPath}`);
    return [];
  }

  const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf-8'));
  metadata.parentId = parentId;
  metadata.actionEnum = ActionEnum.FOLDER
  const node = await createActionMetadataNode(swarmId, metadata);
  const nodes = [node];
  const childrenRelationships: [ActionMetadataNode, ActionMetadataNode[]][] = [];

  const items = await fs.readdir(folderPath);
  for (const item of items) {
    const itemPath = path.join(folderPath, item);
    logger.info(`Found item: ${itemPath}`);
    const stats = await fs.stat(itemPath);
    if (stats.isDirectory()) {
      logger.info(`Processing subfolder: ${itemPath}`);
      const childNodes = await processFolder(itemPath, swarmId, node.id);
      nodes.push(...childNodes);
      childrenRelationships.push([node, childNodes]);
    } else if (item.endsWith('.ts')) {
      logger.info(`Found TypeScript file: ${itemPath}`);
      const content = await fs.readFile(itemPath, 'utf-8');
      if (content.includes('class') && abstractActionClassStrings.some(classString => content.includes(`extends ${classString}`))) {
        const className = content.split('class ')[1].split(' ')[0].trim();
        logger.info(`Found class: ${className} in ${itemPath}`);
        try {
          const cls = await loadClassFromFile(itemPath, className);
          logger.info(`Loaded class: ${cls.name}`);
          if (isConcreteAction(cls) && !content.includes('abstract class')) {
            logger.info(`${className} is a concrete subclass of AbstractAction or AbstractRouter`);
            const actionNode = await createActionMetadataNode(swarmId, {
              parentId: node.id,
              description: cls.description,
              actionEnum: cls.actionEnum,
            });
            nodes.push(actionNode);
            childrenRelationships.push([node, [actionNode]]);
            logger.info(`Created action node from TypeScript file: ${actionNode.id}`);
          } else {
            logger.info(`${className} is not a concrete subclass of AbstractAction or AbstractRouter`);
          }
        } catch (e) {
          logger.error(`Error loading class ${className} from ${itemPath}:`, e);
        }
      }
    }
  }

  return nodes;
}

function isConcreteAction(cls: unknown): cls is typeof AbstractAction | typeof AbstractRouter {
  return (
    typeof cls === 'function' &&
    'description' in cls &&
    'actionEnum' in cls &&
    typeof cls.description === 'string' &&
    typeof cls.actionEnum === 'string'
  );
}

export async function generateActionMetadataTree(userId: string): Promise<void> {
  const secretService = container.get(SecretService);
  const envVars = secretService.getEnvVars();
  const ACTION_FOLDER_PATH = envVars.ACTION_FOLDER_PATH;
  if (!ACTION_FOLDER_PATH) {
    throw new Error('ACTION_FOLDER_PATH environment variable is not set');
  }
  const globalContextDao = container.get(GlobalContextDao);
  const swarmDao = container.get(SwarmDao);

  // Create the default swarm first
  const swarm = await swarmDao.create({
    title: 'Default Swarm',
    goal: 'Default Swarm Goal',
    user: { connect: { id: userId } },
    memory: { create: { title: 'Default Memory', user: { connect: { id: userId } } } }
  });

  logger.info(`Created default swarm with ID: ${swarm.id}`);

  // Now process the action metadata
  const nodes = await processFolder(ACTION_FOLDER_PATH, swarm.id);
  logger.info(`Generated ${nodes.length} action metadata nodes`);

  const globalContextId =envVars.GLOBAL_CONTEXT_ID;
  await globalContextDao.upsertGlobalContext({
    id: globalContextId,
    defaultSwarmId: swarm.id,
  });
}

if (require.main === module) {
  const secretService = container.get(SecretService);
  const userId = secretService.getEnvVars().SEED_USER_ID;
  if (!userId) {
    throw new Error('SEED_USER_ID environment variable is not set');
  }
  generateActionMetadataTree(userId).catch(logger.error);
}
