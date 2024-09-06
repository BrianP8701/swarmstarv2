import { MemoryResolvers } from '../../generated/graphql'
import { container } from '../../../utils/di/container'
import { SwarmDao } from '../../../dao/SwarmDao'
import {
  formatMemoryNode,
} from '../../formatters/swarmFormatter'
import { MemoryDao } from '../../../dao/nodes/MemoryDao'

export const Memory: MemoryResolvers = {
  title: async (parent) => {
    const memoryDao = container.get(MemoryDao)
    const memory = await memoryDao.get(parent.id)
    return memory.title
  },
  memoryNodes: async (parent) => {
    const memoryDao = container.get(MemoryDao)
    const memoryNodes = await memoryDao.getAll(parent.id)
    return memoryNodes.map(formatMemoryNode)
  },
}
