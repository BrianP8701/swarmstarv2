import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type ActionNode = {
  __typename?: 'ActionNode';
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type CreateSwarmInput = {
  createMemory?: InputMaybe<CreateSwarmMemoryInput>;
  existingMemoryId?: InputMaybe<Scalars['ID']['input']>;
  goal: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreateSwarmMemoryInput = {
  title: Scalars['String']['input'];
};

export type MemoryNode = {
  __typename?: 'MemoryNode';
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type RootMutation = {
  __typename?: 'RootMutation';
  createSwarm: Swarm;
};


export type RootMutationCreateSwarmArgs = {
  input: CreateSwarmInput;
};

export type RootQuery = {
  __typename?: 'RootQuery';
  swarm?: Maybe<Swarm>;
  user?: Maybe<User>;
};


export type RootQuerySwarmArgs = {
  id: Scalars['ID']['input'];
};

export type Swarm = {
  __typename?: 'Swarm';
  actions?: Maybe<Array<Maybe<ActionNode>>>;
  chats?: Maybe<Array<Maybe<SwarmChat>>>;
  goal: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  memories?: Maybe<Array<Maybe<MemoryNode>>>;
  memory?: Maybe<SwarmMemory>;
  title: Scalars['String']['output'];
};

export type SwarmChat = {
  __typename?: 'SwarmChat';
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type SwarmMemory = {
  __typename?: 'SwarmMemory';
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID']['output'];
  type: UserTypeEnum;
};

export enum UserTypeEnum {
  Admin = 'ADMIN',
  FreeUser = 'FREE_USER'
}

export type UserFragmentFragment = { __typename?: 'User', id: string, type: UserTypeEnum };

export type SwarmFragmentFragment = { __typename?: 'Swarm', id: string, title: string, goal: string, memory?: { __typename?: 'SwarmMemory', id: string, title: string } | null, chats?: Array<{ __typename?: 'SwarmChat', id: string, title: string } | null> | null, actions?: Array<{ __typename?: 'ActionNode', id: string, title: string } | null> | null, memories?: Array<{ __typename?: 'MemoryNode', id: string, title: string } | null> | null };

export type SwarmMemoryFragmentFragment = { __typename?: 'SwarmMemory', id: string, title: string };

export type SwarmChatFragmentFragment = { __typename?: 'SwarmChat', id: string, title: string };

export type ActionNodeFragmentFragment = { __typename?: 'ActionNode', id: string, title: string };

export type MemoryNodeFragmentFragment = { __typename?: 'MemoryNode', id: string, title: string };

export type FetchUserQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchUserQuery = { __typename?: 'RootQuery', user?: { __typename?: 'User', id: string, type: UserTypeEnum } | null };

export type FetchSwarmQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type FetchSwarmQuery = { __typename?: 'RootQuery', swarm?: { __typename?: 'Swarm', id: string, title: string, goal: string, memory?: { __typename?: 'SwarmMemory', id: string, title: string } | null, chats?: Array<{ __typename?: 'SwarmChat', id: string, title: string } | null> | null, actions?: Array<{ __typename?: 'ActionNode', id: string, title: string } | null> | null, memories?: Array<{ __typename?: 'MemoryNode', id: string, title: string } | null> | null } | null };

export type CreateSwarmMutationVariables = Exact<{
  input: CreateSwarmInput;
}>;


export type CreateSwarmMutation = { __typename?: 'RootMutation', createSwarm: { __typename?: 'Swarm', id: string, title: string, goal: string, memory?: { __typename?: 'SwarmMemory', id: string, title: string } | null, chats?: Array<{ __typename?: 'SwarmChat', id: string, title: string } | null> | null, actions?: Array<{ __typename?: 'ActionNode', id: string, title: string } | null> | null, memories?: Array<{ __typename?: 'MemoryNode', id: string, title: string } | null> | null } };

export const UserFragmentFragmentDoc = gql`
    fragment UserFragment on User {
  id
  type
}
    `;
export const SwarmFragmentFragmentDoc = gql`
    fragment SwarmFragment on Swarm {
  id
  title
  goal
  memory {
    id
    title
  }
  chats {
    id
    title
  }
  actions {
    id
    title
  }
  memories {
    id
    title
  }
}
    `;
export const SwarmMemoryFragmentFragmentDoc = gql`
    fragment SwarmMemoryFragment on SwarmMemory {
  id
  title
}
    `;
export const SwarmChatFragmentFragmentDoc = gql`
    fragment SwarmChatFragment on SwarmChat {
  id
  title
}
    `;
export const ActionNodeFragmentFragmentDoc = gql`
    fragment ActionNodeFragment on ActionNode {
  id
  title
}
    `;
export const MemoryNodeFragmentFragmentDoc = gql`
    fragment MemoryNodeFragment on MemoryNode {
  id
  title
}
    `;
export const FetchUserDocument = gql`
    query FetchUser {
  user {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;

/**
 * __useFetchUserQuery__
 *
 * To run a query within a React component, call `useFetchUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useFetchUserQuery(baseOptions?: Apollo.QueryHookOptions<FetchUserQuery, FetchUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FetchUserQuery, FetchUserQueryVariables>(FetchUserDocument, options);
      }
export function useFetchUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchUserQuery, FetchUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FetchUserQuery, FetchUserQueryVariables>(FetchUserDocument, options);
        }
export function useFetchUserSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<FetchUserQuery, FetchUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FetchUserQuery, FetchUserQueryVariables>(FetchUserDocument, options);
        }
export type FetchUserQueryHookResult = ReturnType<typeof useFetchUserQuery>;
export type FetchUserLazyQueryHookResult = ReturnType<typeof useFetchUserLazyQuery>;
export type FetchUserSuspenseQueryHookResult = ReturnType<typeof useFetchUserSuspenseQuery>;
export type FetchUserQueryResult = Apollo.QueryResult<FetchUserQuery, FetchUserQueryVariables>;
export const FetchSwarmDocument = gql`
    query FetchSwarm($id: ID!) {
  swarm(id: $id) {
    ...SwarmFragment
  }
}
    ${SwarmFragmentFragmentDoc}`;

/**
 * __useFetchSwarmQuery__
 *
 * To run a query within a React component, call `useFetchSwarmQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchSwarmQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchSwarmQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useFetchSwarmQuery(baseOptions: Apollo.QueryHookOptions<FetchSwarmQuery, FetchSwarmQueryVariables> & ({ variables: FetchSwarmQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FetchSwarmQuery, FetchSwarmQueryVariables>(FetchSwarmDocument, options);
      }
export function useFetchSwarmLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchSwarmQuery, FetchSwarmQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FetchSwarmQuery, FetchSwarmQueryVariables>(FetchSwarmDocument, options);
        }
export function useFetchSwarmSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<FetchSwarmQuery, FetchSwarmQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FetchSwarmQuery, FetchSwarmQueryVariables>(FetchSwarmDocument, options);
        }
export type FetchSwarmQueryHookResult = ReturnType<typeof useFetchSwarmQuery>;
export type FetchSwarmLazyQueryHookResult = ReturnType<typeof useFetchSwarmLazyQuery>;
export type FetchSwarmSuspenseQueryHookResult = ReturnType<typeof useFetchSwarmSuspenseQuery>;
export type FetchSwarmQueryResult = Apollo.QueryResult<FetchSwarmQuery, FetchSwarmQueryVariables>;
export const CreateSwarmDocument = gql`
    mutation CreateSwarm($input: CreateSwarmInput!) {
  createSwarm(input: $input) {
    ...SwarmFragment
  }
}
    ${SwarmFragmentFragmentDoc}`;
export type CreateSwarmMutationFn = Apollo.MutationFunction<CreateSwarmMutation, CreateSwarmMutationVariables>;

/**
 * __useCreateSwarmMutation__
 *
 * To run a mutation, you first call `useCreateSwarmMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSwarmMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSwarmMutation, { data, loading, error }] = useCreateSwarmMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSwarmMutation(baseOptions?: Apollo.MutationHookOptions<CreateSwarmMutation, CreateSwarmMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSwarmMutation, CreateSwarmMutationVariables>(CreateSwarmDocument, options);
      }
export type CreateSwarmMutationHookResult = ReturnType<typeof useCreateSwarmMutation>;
export type CreateSwarmMutationResult = Apollo.MutationResult<CreateSwarmMutation>;
export type CreateSwarmMutationOptions = Apollo.BaseMutationOptions<CreateSwarmMutation, CreateSwarmMutationVariables>;