import assert from 'assert'
import { ResolverContext } from '../../createApolloGqlServer'
import { UserMutationResolvers } from '../../generated/graphql'
import { UserDao } from '../../../dao/UserDao'
import { PanelLayoutDao } from '../../../dao/PanelLayoutDao'
import { PanelLayoutService } from '../../../services/PanelLayoutService'

export const UserMutation: UserMutationResolvers = {
  selectTheme: async (_, { theme }, { req, container }: ResolverContext) => {
    assert(req.user, 'User not found')
    const userId = req.user.id
    const userDao = await container.get(UserDao)
    await userDao.update(userId, {
      theme: theme,
    })
    return { id: userId }
  },
  selectPanelLayout: async (_, { panelLayoutId }, { req, container }: ResolverContext) => {
    assert(req.user, 'User not found')
    const userId = req.user.id
    const panelLayoutDao = await container.get(PanelLayoutDao)
    await panelLayoutDao.updatePanelLayoutLastUsed(userId, panelLayoutId)
    return { id: userId }
  },
  createPanelLayout: async (_, { input }, { req, container }: ResolverContext) => {
    assert(req.user, 'User not found')
    const userId = req.user.id
    const panelLayoutService = await container.get(PanelLayoutService)
    await panelLayoutService.createPanelLayout(userId, input)
    return { id: userId }
  },
}
