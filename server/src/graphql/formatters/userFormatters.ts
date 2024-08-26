import { UserTypeEnum } from "@prisma/client"
import { UserTypeEnum as GqlUserTypeEnum } from "../generated/graphql"

export const formatUserTypeEnum = (userTypeEnum: UserTypeEnum): GqlUserTypeEnum => {
  switch (userTypeEnum) {
    case UserTypeEnum.ADMIN:
      return GqlUserTypeEnum.Admin
    case UserTypeEnum.USER:
      return GqlUserTypeEnum.User
    default:
      throw new Error(`Unknown user type enum: ${userTypeEnum}`)
  }
}
