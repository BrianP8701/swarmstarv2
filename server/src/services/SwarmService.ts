import { inject, injectable } from 'inversify'
import { ActionEnum, MessageRoleEnum, Swarm } from '@prisma/client'
import { CreateSwarmRequest } from '../graphql/generated/graphql'
import { SwarmDao } from '../dao/SwarmDao'

@injectable()
export class SwarmService {
  constructor(
    @inject(SwarmDao) private swarmDao: SwarmDao
  ) { }

  public async createSwarm(userId: string, createSwarmRequest: CreateSwarmRequest): Promise<Swarm> {
    // Step 1: Create the swarm without chats
    const swarm = await this.swarmDao.create({
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
      }
    });

    // Step 2: Now that the swarm exists, create the chats and actionNodes
    await this.swarmDao.update(swarm.id, {
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
                },
                swarm: {
                  connect: {
                    id: swarm.id // Now you have the swarm id
                  }
                }
              }]
            }
          }]
        }
      })

    return swarm
  }
}
