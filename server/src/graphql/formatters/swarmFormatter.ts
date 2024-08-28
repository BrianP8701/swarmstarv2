import { 
  Swarm, 
  Memory, 
  Chat, 
  MemoryNode, 
  ActionNode, 
  ActionMetadataNode,
  ActionEnum
} from "@prisma/client"
import { 
  Swarm as GqlSwarm, 
  Memory as GqlMemory, 
  Chat as GqlChat, 
  MemoryNode as GqlMemoryNode, 
  ActionNode as GqlActionNode, 
  ActionMetadataNode as GqlActionMetadataNode,
  ActionEnum as GqlActionEnum
} from "../generated/graphql"
import { snakeToTitleCase } from "./utils"

export const formatSwarm = (swarm: Swarm & { chats: Chat[], memory: Memory, memories: MemoryNode[], actions: ActionNode[], actionMetadata: ActionMetadataNode[] }): GqlSwarm => {
  return {
    id: swarm.id,
    title: swarm.title,
    goal: swarm.goal,
    memory: formatMemory(swarm.memory),
    chats: swarm.chats.map(formatChat),
    memories: swarm.memories.map(formatMemoryNode),
    actions: swarm.actions.map(formatActionNode),
    actionMetadata: swarm.actionMetadata.map(formatActionMetadataNode),
  }
}

export const formatChat = (chat: Chat): GqlChat => {
  return {
    id: chat.id,
    title: chat.title,
  }
}

export const formatMemory = (memory: Memory): GqlMemory => {
  return {
    id: memory.id,
    title: memory.title,
  }
}

export const formatMemoryNode = (memoryNode: MemoryNode): GqlMemoryNode => {
  return {
    id: memoryNode.id,
    title: memoryNode.title,
    parentId: memoryNode.parentId,
  }
}

export const formatActionNode = (actionNode: ActionNode): GqlActionNode => {
  return {
    id: actionNode.id,
    title: snakeToTitleCase(actionNode.actionEnum),
    parentId: actionNode.parentId,
  }
}

export const formatActionMetadataNode = (actionMetadataNode: ActionMetadataNode): GqlActionMetadataNode => {
  return {
    id: actionMetadataNode.id,
    title: snakeToTitleCase(actionMetadataNode.actionEnum),
    parentId: actionMetadataNode.parentId,
    description: actionMetadataNode.description,
  }
}

export const formatActionEnum = (actionEnum: ActionEnum): GqlActionEnum => {
  switch (actionEnum) {
    case ActionEnum.FOLDER:
      return GqlActionEnum.Folder
    case ActionEnum.CODE:
      return GqlActionEnum.Code
    case ActionEnum.PLAN:
      return GqlActionEnum.Plan
    case ActionEnum.REVIEW_GOAL_PROGRESS:
      return GqlActionEnum.ReviewGoalProgress
    case ActionEnum.ROUTE_ACTION:
      return GqlActionEnum.RouteAction
    case ActionEnum.SEARCH:
      return GqlActionEnum.Search
    default:
      return GqlActionEnum.Folder
  }
}