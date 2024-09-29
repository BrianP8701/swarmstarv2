import { 
  AgentNodeEdge,
  AgentNodeEdgeTypeEnum
} from "@prisma/client"
import { 
  AgentNodeEdge as GqlAgentNodeEdge,
  AgentNodeEdgeTypeEnum as GqlAgentNodeEdgeTypeEnum
} from "../../generated/graphql"


export const formatAgentNodeEdgeToGqlAgentNodeEdge = (edge: AgentNodeEdge): GqlAgentNodeEdge => {
  return {
    id: edge.id,
    type: formatAgentNodeEdgeTypeEnumToGqlAgentNodeEdgeTypeEnum(edge.type),
    startNodeId: edge.startNodeId,
    endNodeId: edge.endNodeId,
  }
}

export const formatAgentNodeEdgeTypeEnumToGqlAgentNodeEdgeTypeEnum = (type: AgentNodeEdgeTypeEnum): GqlAgentNodeEdgeTypeEnum => {
  switch (type) {
    case AgentNodeEdgeTypeEnum.SPAWN:
      return GqlAgentNodeEdgeTypeEnum.Spawn
    case AgentNodeEdgeTypeEnum.KILL:
      return GqlAgentNodeEdgeTypeEnum.Kill
    case AgentNodeEdgeTypeEnum.RETURN:
      return GqlAgentNodeEdgeTypeEnum.Return
  }
}
