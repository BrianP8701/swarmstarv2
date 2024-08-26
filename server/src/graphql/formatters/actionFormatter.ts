import { ActionEnum, ActionMetadataNode } from "@prisma/client"
import { ActionEnum as GqlActionEnum, ActionMetadataNode as GqlActionMetadataNode } from "../generated/graphql"

export const formatActionEnum = (actionEnum: ActionEnum): GqlActionEnum => {
  switch (actionEnum) {
    case ActionEnum.CODE:
      return GqlActionEnum.Code
    case ActionEnum.FOLDER:
      return GqlActionEnum.Folder
    case ActionEnum.PLAN:
      return GqlActionEnum.Plan
    case ActionEnum.ROUTE_ACTION:
      return GqlActionEnum.RouteAction
    case ActionEnum.SEARCH:
      return GqlActionEnum.Search
    case ActionEnum.REVIEW_GOAL_PROGRESS:
      return GqlActionEnum.ReviewGoalProgress
    default:
      throw new Error(`Unknown action enum: ${actionEnum}`)
  }
}

export const formatActionMetadataNode = (actionMetadataNode: ActionMetadataNode): GqlActionMetadataNode => {
  return {
    ...actionMetadataNode,
    actionEnum: formatActionEnum(actionMetadataNode.actionEnum),
  }
}
