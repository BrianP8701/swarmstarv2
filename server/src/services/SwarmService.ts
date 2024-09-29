import { inject, injectable } from 'inversify'
import { ActionEnum, Swarm } from '@prisma/client'
import { CreateSwarmRequest } from '../graphql/generated/graphql'
import { SwarmDao } from '../dao/SwarmDao'
import { AgentNodeDao } from '../dao/nodes/AgentNodeDao';
import { ChatDao } from '../dao/ChatDao';
import { AgentGraphDao } from '../dao/graphs/AgentGraphDao';

@injectable()
export class SwarmService {
  constructor(
    @inject(SwarmDao) private swarmDao: SwarmDao,
    @inject(AgentNodeDao) private agentDao: AgentNodeDao,
    @inject(ChatDao) private chatDao: ChatDao,
    @inject(AgentGraphDao) private agentGraphDao: AgentGraphDao
  ) { }

  public async createSwarm(userId: string, createSwarmRequest: CreateSwarmRequest): Promise<Swarm> {
    // Step 1: Create the swarm without chats
    const swarm = await this.swarmDao.create({
      title: createSwarmRequest.title,
      goal: createSwarmRequest.goal,
      informationGraph: {
        connect: {
          id: createSwarmRequest.informationGraphId
        }
      },
      user: {
        connect: {
          id: userId
        }
      }
    });

    const agentGraph = await this.agentGraphDao.create({
      swarm: {
        connect: {
          id: swarm.id
        }
      }
    });

    await this.swarmDao.update(swarm.id, {
      agentGraph: {
        connect: {
          id: agentGraph.id
        }
      }
    })

    // Step 2: Now that the swarm exists, create a agent
    const agent = await this.agentDao.create({
      agentGraph: {
        connect: {
          id: agentGraph.id
        }
      },
      goal: createSwarmRequest.goal,
      actionEnum: ActionEnum.PLAN
    });

    // Step 3: Create a chat for the agent
    await this.chatDao.create({
      title: 'Root Chat',
      swarm: {
        connect: {
          id: swarm.id
        }
      },
      agentNode: {
        connect: {
          id: agent.id
        }
      }
    })

    return swarm;
  }
}
