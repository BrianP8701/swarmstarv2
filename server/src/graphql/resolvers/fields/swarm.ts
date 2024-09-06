import { SwarmResolvers } from '../../generated/graphql'
import { container } from '../../../utils/di/container'
import { SwarmDao } from '../../../dao/SwarmDao'

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
  data: async (parent) => {
    return { id: parent.id }
  }
}
