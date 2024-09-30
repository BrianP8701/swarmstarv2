import { inject, injectable } from 'inversify'
import { Swarm } from '@prisma/client'
import { CreateSwarmRequest } from '../graphql/generated/graphql'
import { SwarmDao } from '../dao/SwarmDao'
import { AgentGraphService } from './AgentGraphService';

@injectable()
export class SwarmService {
  constructor(
    @inject(SwarmDao) private swarmDao: SwarmDao,
    @inject(AgentGraphService) private agentGraphService: AgentGraphService,
  ) { }

  public async createSwarm(userId: string, createSwarmRequest: CreateSwarmRequest): Promise<Swarm> {
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

    const agentGraph = await this.agentGraphService.createAgentGraph(swarm.id, createSwarmRequest.goal);

    // Update the swarm with the agentGraphId
    const updatedSwarm = await this.swarmDao.update(swarm.id, {
      agentGraphId: agentGraph.id
    });

    return updatedSwarm;
  }
}
