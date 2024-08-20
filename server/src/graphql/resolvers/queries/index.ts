import { QueryResolvers } from '../../generated/graphql'

export const RootQuery: QueryResolvers = {
  user: async (_, { id }) => {
    return { id }
  }
}
