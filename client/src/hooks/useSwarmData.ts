import { useState, useEffect, useCallback } from 'react'
import {
  useFetchSwarmLazyQuery,
  useFetchActionGraphLazyQuery,
  SwarmFragment,
  ActionGraphFragment,
  AgentGraphFragment,
  UserFragment,
} from '../graphql/generated/graphql'

export type AppState = {
  swarm: SwarmFragment | undefined
  actionGraph: ActionGraphFragment | undefined
  agentGraph: AgentGraphFragment | undefined
  selectedChatId: string | null
  setSelectedChatId: (id: string | null) => void
  selectedSwarmId: string | undefined
  setSelectedSwarmId: (id: string | undefined) => void
}

export function useSwarmData(initialSelectedSwarmId: string | undefined, user: UserFragment | null): AppState {
  const [fetchSwarm, { data: fetchSwarmQuery }] = useFetchSwarmLazyQuery()
  const [fetchActionGraph, { data: fetchActionGraphQuery }] = useFetchActionGraphLazyQuery()

  const [selectedSwarmId, setSelectedSwarmId] = useState<string | undefined>(initialSelectedSwarmId)
  const [swarm, setSwarm] = useState<SwarmFragment | undefined>(undefined)
  const [actionGraph, setActionGraph] = useState<ActionGraphFragment | undefined>(undefined)
  const [agentGraph, setAgentGraph] = useState<AgentGraphFragment | undefined>(undefined)
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)

  const fetchSwarmData = useCallback(() => {
    if (selectedSwarmId) {
      fetchSwarm({ variables: { swarmId: selectedSwarmId } })
      fetchActionGraph()
    }
  }, [selectedSwarmId, fetchSwarm, fetchActionGraph])

  useEffect(() => {
    fetchSwarmData()
  }, [fetchSwarmData])

  useEffect(() => {
    if (fetchSwarmQuery?.swarm) {
      setSwarm(fetchSwarmQuery.swarm)
      setAgentGraph(fetchSwarmQuery.swarm.agentGraph ?? undefined)
    }
  }, [fetchSwarmQuery])

  useEffect(() => {
    if (fetchActionGraphQuery?.actionGraph) {
      setActionGraph(fetchActionGraphQuery.actionGraph)
    }
  }, [fetchActionGraphQuery])

  useEffect(() => {
    if (user && user.swarms && user.swarms.length > 0 && !selectedSwarmId) {
      setSelectedSwarmId(user.swarms[0].id)
    }
  }, [user, selectedSwarmId])

  useEffect(() => {
    if (swarm && swarm.chats && swarm.chats.length > 0 && !selectedChatId) {
      setSelectedChatId(swarm.chats[0].id)
    }
  }, [swarm, selectedChatId])

  return { swarm, actionGraph, agentGraph, selectedChatId, setSelectedChatId, selectedSwarmId, setSelectedSwarmId }
}
