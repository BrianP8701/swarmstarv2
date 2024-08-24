import { GraphQLResolveInfo } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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
  swarm?: Maybe<SwarmMutation>;
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

export type SwarmMutation = {
  __typename?: 'SwarmMutation';
  createSwarm: Swarm;
};


export type SwarmMutationCreateSwarmArgs = {
  input: CreateSwarmInput;
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



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  ActionNode: ResolverTypeWrapper<ActionNode>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateSwarmInput: CreateSwarmInput;
  CreateSwarmMemoryInput: CreateSwarmMemoryInput;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  MemoryNode: ResolverTypeWrapper<MemoryNode>;
  RootMutation: ResolverTypeWrapper<{}>;
  RootQuery: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Swarm: ResolverTypeWrapper<Swarm>;
  SwarmChat: ResolverTypeWrapper<SwarmChat>;
  SwarmMemory: ResolverTypeWrapper<SwarmMemory>;
  SwarmMutation: ResolverTypeWrapper<SwarmMutation>;
  User: ResolverTypeWrapper<User>;
  UserTypeEnum: UserTypeEnum;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  ActionNode: ActionNode;
  Boolean: Scalars['Boolean']['output'];
  CreateSwarmInput: CreateSwarmInput;
  CreateSwarmMemoryInput: CreateSwarmMemoryInput;
  ID: Scalars['ID']['output'];
  MemoryNode: MemoryNode;
  RootMutation: {};
  RootQuery: {};
  String: Scalars['String']['output'];
  Swarm: Swarm;
  SwarmChat: SwarmChat;
  SwarmMemory: SwarmMemory;
  SwarmMutation: SwarmMutation;
  User: User;
};

export type ActionNodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ActionNode'] = ResolversParentTypes['ActionNode']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MemoryNodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['MemoryNode'] = ResolversParentTypes['MemoryNode']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RootMutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['RootMutation'] = ResolversParentTypes['RootMutation']> = {
  swarm?: Resolver<Maybe<ResolversTypes['SwarmMutation']>, ParentType, ContextType>;
};

export type RootQueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['RootQuery'] = ResolversParentTypes['RootQuery']> = {
  swarm?: Resolver<Maybe<ResolversTypes['Swarm']>, ParentType, ContextType, RequireFields<RootQuerySwarmArgs, 'id'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
};

export type SwarmResolvers<ContextType = any, ParentType extends ResolversParentTypes['Swarm'] = ResolversParentTypes['Swarm']> = {
  actions?: Resolver<Maybe<Array<Maybe<ResolversTypes['ActionNode']>>>, ParentType, ContextType>;
  chats?: Resolver<Maybe<Array<Maybe<ResolversTypes['SwarmChat']>>>, ParentType, ContextType>;
  goal?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  memories?: Resolver<Maybe<Array<Maybe<ResolversTypes['MemoryNode']>>>, ParentType, ContextType>;
  memory?: Resolver<Maybe<ResolversTypes['SwarmMemory']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SwarmChatResolvers<ContextType = any, ParentType extends ResolversParentTypes['SwarmChat'] = ResolversParentTypes['SwarmChat']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SwarmMemoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['SwarmMemory'] = ResolversParentTypes['SwarmMemory']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SwarmMutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['SwarmMutation'] = ResolversParentTypes['SwarmMutation']> = {
  createSwarm?: Resolver<ResolversTypes['Swarm'], ParentType, ContextType, RequireFields<SwarmMutationCreateSwarmArgs, 'input'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['UserTypeEnum'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  ActionNode?: ActionNodeResolvers<ContextType>;
  MemoryNode?: MemoryNodeResolvers<ContextType>;
  RootMutation?: RootMutationResolvers<ContextType>;
  RootQuery?: RootQueryResolvers<ContextType>;
  Swarm?: SwarmResolvers<ContextType>;
  SwarmChat?: SwarmChatResolvers<ContextType>;
  SwarmMemory?: SwarmMemoryResolvers<ContextType>;
  SwarmMutation?: SwarmMutationResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

