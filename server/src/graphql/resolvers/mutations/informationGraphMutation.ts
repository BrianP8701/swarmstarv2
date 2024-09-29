import assert from 'assert'
import { ResolverContext } from '../../createApolloGqlServer'
import { InformationGraphMutationResolvers } from '../../generated/graphql'
import { InformationGraphDao } from '../../../dao/graphs/InformationGraphDao'

export const InformationGraphMutation: InformationGraphMutationResolvers = {
  createInformationGraph: async (_, { input }, { req, container }: ResolverContext) => {
    assert(req.user, 'User not found')
    const informationGraphDao = await container.get(InformationGraphDao)
    const informationGraph = await informationGraphDao.create({
      title: input.title,
      user: {
        connect: {
          id: req.user.id
        }
      },
    })
    return informationGraph
  }
}
