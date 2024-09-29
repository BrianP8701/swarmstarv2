import { SwarmResolvers } from '../../generated/graphql'
import { container } from '../../../utils/di/container'
import { SwarmDao } from '../../../dao/SwarmDao'
import { formatDbChatToGqlChat } from '../../formatters/chatFormatters'
import assert from 'assert'

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
  chats: async (parent) => {
    const swarmDao = container.get(SwarmDao)
    const swarm = await swarmDao.getWithChats(parent.id)
    return swarm.chats.map(formatDbChatToGqlChat)
  },
  informationGraph: async (parent) => {
    const swarmDao = container.get(SwarmDao)
    const swarm = await swarmDao.get(parent.id)
    return {
      id: swarm.informationGraphId,
    }
  },
  agentGraph: async (parent) => {
    const swarmDao = container.get(SwarmDao)
    const swarm = await swarmDao.get(parent.id)
    assert(swarm.agentGraphId, 'Swarm does not have an agent graph')
    return {
      id: swarm.agentGraphId,
    }
  },
}
