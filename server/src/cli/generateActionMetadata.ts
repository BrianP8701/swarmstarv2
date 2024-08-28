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

const abstractActionClassStrings = ["AbstractAction", "AbstractRouter"]

const ACTION_FOLDER_PATH = process.env.ACTION_FOLDER_PATH

async function createActionMetadataNode(swarmId: string, nodeData: any): Promise<ActionMetadataNode> {
  const actionMetadataNodeDao = container.get(ActionMetadataNodeDao);
  console.log(nodeData);

  const createInput: Prisma.ActionMetadataNodeCreateInput = {
    description: nodeData.description,
    actionEnum: nodeData.actionEnum,
    swarm: { connect: { id: swarmId } }
  };
  if (nodeData.parentId) {
    createInput.parent = { connect: { id: nodeData.parentId } };
  }
  const node = await actionMetadataNodeDao.create(createInput);
  console.log(`Created action metadata node: ${node.id}`);
  return node;
}

async function loadClassFromFile(filePath: string, className: string): Promise<any> {
  const module = await import(filePath);
  return module[className];
}

async function processFolder(folderPath: string, swarmId: string, parentId: string | null = null): Promise<ActionMetadataNode[]> {
  console.log(`Processing folder: ${folderPath}`);
  const metadataPath = path.join(folderPath, 'metadata.json');

  try {
    await fs.access(metadataPath);
  } catch {
    console.log(`No metadata found in: ${folderPath}`);
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
    console.log(`Found item: ${itemPath}`);
    const stats = await fs.stat(itemPath);
    if (stats.isDirectory()) {
      console.log(`Processing subfolder: ${itemPath}`);
      const childNodes = await processFolder(itemPath, swarmId, node.id);
      nodes.push(...childNodes);
      childrenRelationships.push([node, childNodes]);
    } else if (item.endsWith('.ts')) {
      console.log(`Found TypeScript file: ${itemPath}`);
      const content = await fs.readFile(itemPath, 'utf-8');
      // if (content.includes('class') && (content.includes('extends AbstractAction') || content.includes('extends AbstractRouter'))) {
      if (content.includes('class') && (abstractActionClassStrings.map(classString => content.includes(`extends ${classString}`)))) {
        const className = content.split('class ')[1].split('extends')[0].trim();
        console.log(`Found class: ${className} in ${itemPath}`);
        try {
          const cls = await loadClassFromFile(itemPath, className);
          console.log(`Loaded class: ${cls.name}`);
          if (isConcreteAction(cls) && !content.includes('abstract class')) {
            console.log(`${className} is a concrete subclass of AbstractAction`);
            const actionNode = await createActionMetadataNode(swarmId, {
              parentId: node.id,
              description: cls.description,
              actionEnum: cls.actionEnum,
            });
            nodes.push(actionNode);
            childrenRelationships.push([node, [actionNode]]);
            console.log(`Created action node from TypeScript file: ${actionNode.id}`);
          } else {
            console.log(`${className} is not a concrete subclass of AbstractAction or AbstractRouter`);
          }
        } catch (e) {
          console.error(`Error loading class ${className} from ${itemPath}:`, e);
        }
      }
    }
  }

  return nodes;
}

function isConcreteAction(cls: any): cls is typeof AbstractAction | typeof AbstractRouter {
  return typeof cls.description === 'string' &&
    typeof cls.actionEnum === 'string';
}

export async function generateActionMetadataTree(userId: string): Promise<void> {
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
    memory: { create: { title: 'Default Memory', user: { connect: { id: userId } } } },
  });

  console.log(`Created default swarm with ID: ${swarm.id}`);

  // Now process the action metadata
  const nodes = await processFolder(ACTION_FOLDER_PATH, swarm.id);
  console.log(`Generated ${nodes.length} action metadata nodes`);

  const globalContextId = process.env.GLOBAL_CONTEXT_ID;
  await globalContextDao.upsertGlobalContext({
    id: globalContextId,
    defaultSwarmId: swarm.id,
  });
}

if (require.main === module) {
  const userId = process.env.SEED_USER_ID;
  if (!userId) {
    throw new Error('SEED_USER_ID environment variable is not set');
  }
  generateActionMetadataTree(userId).catch(console.error);
}
