import 'reflect-metadata';
import fs from 'fs/promises';
import path from 'path';
import { ActionMetadataNode, Prisma } from '@prisma/client';
import { container } from '../utils/di/container';
import { ActionMetadataNodeDao } from '../dao/nodes/ActionMetadataDao';
import { AbstractAction } from '../swarmstar/action/AbstractAction';
import { AbstractRouter } from '../swarmstar/action/routers/AbstractRouter';

const ACTION_FOLDER_PATH = process.env.ACTION_FOLDER_PATH

async function createActionMetadataNode(nodeData: any): Promise<ActionMetadataNode> {
  const actionMetadataNodeDao = container.get(ActionMetadataNodeDao);
  console.log(nodeData);
  const existingNode = await actionMetadataNodeDao.exists(nodeData.id);
  if (existingNode) {
    await actionMetadataNodeDao.delete(nodeData.id);
  }
  const createInput: Prisma.ActionMetadataNodeCreateInput = {
    id: nodeData.id,
    description: nodeData.description,
    actionEnum: nodeData.actionEnum,
  };
  if (nodeData.parentId) {
    createInput.parent = { connect: { id: nodeData.parentId } };
  }
  const node = await actionMetadataNodeDao.create(createInput);
  console.log(`Created action metadata node: ${node.id}`);
  return node;
}

async function loadClassFromFile(filePath: string, className: string): Promise<typeof AbstractAction> {
  const module = await import(filePath);
  return module[className];
}

async function processFolder(folderPath: string, parentId: string | null = null): Promise<ActionMetadataNode[]> {
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
  metadata.actionEnum = 'FOLDER';
  const node = await createActionMetadataNode(metadata);
  const nodes = [node];
  const childrenRelationships: [ActionMetadataNode, ActionMetadataNode[]][] = [];

  const items = await fs.readdir(folderPath);
  for (const item of items) {
    const itemPath = path.join(folderPath, item);
    console.log(`Found item: ${itemPath}`);
    const stats = await fs.stat(itemPath);
    if (stats.isDirectory()) {
      console.log(`Processing subfolder: ${itemPath}`);
      const childNodes = await processFolder(itemPath, node.id);
      nodes.push(...childNodes);
      childrenRelationships.push([node, childNodes]);
    } else if (item.endsWith('.ts')) {
      console.log(`Found TypeScript file: ${itemPath}`);
      const content = await fs.readFile(itemPath, 'utf-8');
      if (content.includes('class') && (content.includes('extends AbstractAction') || content.includes('extends AbstractRouter'))) {
        const className = content.split('class ')[1].split('extends')[0].trim();
        console.log(`Found class: ${className} in ${itemPath}`);
        try {
          const cls = await loadClassFromFile(itemPath, className);
          console.log(`Loaded class: ${cls.name}`);
          if (isConcreteAction(cls) && !content.includes('abstract class')) {
            console.log(`${className} is a concrete subclass of AbstractAction or AbstractRouter`);
            const actionNode = await createActionMetadataNode({
              id: cls.id,
              parentId: node.id,
              description: cls.description,
              actionEnum: cls.actionEnum.toString(),
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
  return typeof cls.id === 'string' &&
         typeof cls.description === 'string' &&
         typeof cls.actionEnum === 'string';
}

async function generateActionMetadataTree() {
  if (!ACTION_FOLDER_PATH) {
    throw new Error('ACTION_FOLDER_PATH environment variable is not set');
  }
  const nodes = await processFolder(ACTION_FOLDER_PATH);
  console.log(`Generated ${nodes.length} action metadata nodes`);
}

generateActionMetadataTree().catch(console.error);
