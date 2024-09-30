import { DocumentNode } from 'graphql'
import { resolve } from 'path'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadTypedefsSync } from '@graphql-tools/load'

const sources = loadTypedefsSync(resolve(__dirname, 'schema.gql'), { loaders: [new GraphQLFileLoader()] })
export const typeDefs = sources.map(source => source.document).filter((x): x is DocumentNode => x !== null)
