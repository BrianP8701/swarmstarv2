import { inject, injectable } from 'inversify'
import { ActionEnum, MessageRoleEnum, Swarm } from '@prisma/client'
import { CreateSwarmRequest } from '../graphql/generated/graphql'
import { v4 as uuidv4 } from 'uuid'
import { SwarmDao } from '../dao/SwarmDao'

@injectable()
export class SwarmService {
  constructor(
    @inject(SwarmDao) private swarmDao: SwarmDao
  ) { }

  public async createSwarm(userId: string, createSwarmRequest: CreateSwarmRequest): Promise<Swarm> {
    const swarmId = uuidv4()

    const swarm = await this.swarmDao.create({
      id: swarmId,
      title: createSwarmRequest.title,
      goal: createSwarmRequest.goal,
      memory: {
        connect: {
          id: createSwarmRequest.memoryId
        }
      },
      user: {
        connect: {
          id: userId
        }
      },
      actionNodes: {
        create: [{
          goal: createSwarmRequest.goal,
          actionEnum: ActionEnum.PLAN,
          chats: {
            create: [{
              title: createSwarmRequest.title,
              messages: {
                create: [{
                  content: createSwarmRequest.goal,
                  role: MessageRoleEnum.USER
                }]
              }
            }]
          }
        }]
      },
    })

    return swarm
  }
}
