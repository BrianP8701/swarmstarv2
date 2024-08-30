import { SwarmResolvers } from '../../generated/graphql'
import { container } from '../../../utils/di/container'
import { SwarmDao } from '../../../dao/SwarmDao'
import { 
  formatMemory, 
  formatChat, 
  formatActionNode, 
  formatMemoryNode, 
  formatActionMetadataNode 
} from '../../formatters/swarmFormatter'

export const Swarm: SwarmResolvers = {
  title: async (parent) => {
    const swarmDao = container.get(SwarmDao)
    const swarm = await swarmDao.getBasic(parent.id)
    return swarm.title
  },
  goal: async (parent) => {
    const swarmDao = container.get(SwarmDao)
    const swarm = await swarmDao.getBasic(parent.id)
    return swarm.goal
  },
  memory: async (parent) => {
    const swarmDao = container.get(SwarmDao)
    const swarm = await swarmDao.getWithMemory(parent.id)
    return formatMemory(swarm.memory)
  },
  chats: async (parent) => {
    const swarmDao = container.get(SwarmDao)
    const swarm = await swarmDao.getWithChats(parent.id)
    return swarm.chats.map(formatChat)
  },
  actions: async (parent) => {
    const swarmDao = container.get(SwarmDao)
    const swarm = await swarmDao.getWithActionNodes(parent.id)
    return swarm.actionNodes.map(formatActionNode)
  },
  memories: async (parent) => {
    const swarmDao = container.get(SwarmDao)
    const swarm = await swarmDao.getWithMemoryNodes(parent.id)
    return swarm.memory.memoryNodes.map(formatMemoryNode)
  },
  actionMetadata: async (parent) => {
    const swarmDao = container.get(SwarmDao)
    const swarm = await swarmDao.getWithActionMetadata(parent.id)
    return swarm.actionMetadataNodes.map(formatActionMetadataNode)
  },
}
