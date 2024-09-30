import { 
  AgentEdge,
  AgentEdgeTypeEnum
} from "@prisma/client"
import { 
  AgentEdge as GqlAgentEdge,
  AgentEdgeTypeEnum as GqlAgentEdgeTypeEnum
} from "../../generated/graphql"


export const formatAgentEdgeToGqlAgentEdge = (edge: AgentEdge): GqlAgentEdge => {
  return {
    id: edge.id,
    type: formatAgentEdgeTypeEnumToGqlAgentEdgeTypeEnum(edge.type),
    startNodeId: edge.startNodeId,
    endNodeId: edge.endNodeId,
  }
}

export const formatAgentEdgeTypeEnumToGqlAgentEdgeTypeEnum = (type: AgentEdgeTypeEnum): GqlAgentEdgeTypeEnum => {
  switch (type) {
    case AgentEdgeTypeEnum.SPAWN:
      return GqlAgentEdgeTypeEnum.Spawn
    case AgentEdgeTypeEnum.KILL:
      return GqlAgentEdgeTypeEnum.Kill
    case AgentEdgeTypeEnum.RETURN:
      return GqlAgentEdgeTypeEnum.Return
  }
}
