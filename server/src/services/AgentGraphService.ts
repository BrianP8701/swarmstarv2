import { inject, injectable } from 'inversify'
import { AgentGraphDao } from '../dao/graphs/AgentGraphDao'
import { AgentNodeDao } from '../dao/nodes/AgentNodeDao'
import { ActionEnum, AgentGraph, MessageRoleEnum } from '@prisma/client'
import { ChatDao } from '../dao/ChatDao'

@injectable()
export class AgentGraphService {
  constructor(
    @inject(AgentGraphDao) private agentGraphDao: AgentGraphDao,
    @inject(AgentNodeDao) private agentNodeDao: AgentNodeDao,
    @inject(ChatDao) private chatDao: ChatDao
  ) { }

  public async createAgentGraph(swarmId: string, goal: string): Promise<AgentGraph> {
    const agentGraph = await this.agentGraphDao.create({
      swarm: {
        connect: {
          id: swarmId
        }
      }
    });
    const agentNode = await this.agentNodeDao.create({
      agentGraph: {
        connect: {
          id: agentGraph.id
        }
      },
      goal,
      actionEnum: ActionEnum.PLAN
    });
    await this.chatDao.create({
      agentNode: {
        connect: {
          id: agentNode.id
        }
      },
      swarm: {
        connect: {
          id: swarmId
        }
      },
      messages: {
        create: {
          content: goal,
          role: MessageRoleEnum.USER
        }
      },
      title: 'Root Chat'
    });
    return agentGraph;
  }
}
