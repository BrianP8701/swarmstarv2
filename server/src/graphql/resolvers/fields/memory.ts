import { MemoryResolvers } from '../../generated/graphql'
import { container } from '../../../utils/di/container'
import { SwarmDao } from '../../../dao/SwarmDao'
import {
  formatMemoryNode,
} from '../../formatters/swarmFormatter'
import { MemoryDao } from '../../../dao/nodes/MemoryDao'

export const Memory: MemoryResolvers = {
  title: async (parent) => {
    const swarmDao = container.get(SwarmDao)
    const swarm = await swarmDao.getBasic(parent.id)
    return swarm.title
  },
  memoryNodes: async (parent) => {
    const memoryDao = container.get(MemoryDao)
    const memoryNodes = await memoryDao.getAll(parent.id)
    return memoryNodes.map(formatMemoryNode)
  },
}
