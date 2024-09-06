import { SwarmDataResolvers } from '../../generated/graphql'
import { container } from '../../../utils/di/container'
import { SwarmDao } from '../../../dao/SwarmDao'
import {
  formatChat,
  formatActionNode,
  formatMemoryNode,
  formatActionMetadataNode
} from '../../formatters/swarmFormatter'
import { MemoryDao } from '../../../dao/nodes/MemoryDao'

export const SwarmData: SwarmDataResolvers = {
  memoryNodes: async (parent) => {
    const memoryDao = container.get(MemoryDao)
    const memoryNodes = await memoryDao.getAll(parent.id)
    return memoryNodes.map(formatMemoryNode)
  },
  actionNodes: async (parent) => {
    const swarmDao = container.get(SwarmDao)
    const swarm = await swarmDao.getWithActionNodes(parent.id)
    return swarm.actionNodes.map(formatActionNode)
  },
  actionMetadataNodes: async (parent) => {
    const swarmDao = container.get(SwarmDao)
    const swarm = await swarmDao.getWithActionMetadata(parent.id)
    return swarm.actionMetadataNodes.map(formatActionMetadataNode)
  },
  chats: async (parent) => {
    const swarmDao = container.get(SwarmDao)
    const swarm = await swarmDao.getWithChats(parent.id)
    return swarm.chats.map(formatChat)
  },
}
