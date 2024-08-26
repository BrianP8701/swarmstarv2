import { Swarm, Memory, Chat } from "@prisma/client"
import { Swarm as GqlSwarm, Memory as GqlMemory, Chat as GqlChat } from "../generated/graphql"

export const formatSwarm = (swarm: Swarm): GqlSwarm => {
  return {
    id: swarm.id,
    title: swarm.title,
    goal: swarm.goal
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
