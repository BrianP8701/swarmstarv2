import { AgentNode, ActionEnum, PlanContext, RouteActionContext, SearchContext } from '@prisma/client';
import { AgentNodeDao } from '../../dao/nodes/AgentNodeDao';
import { IsContextSufficientInstructor } from '../instructors/IsContextSufficientInstructor';
import { AskQuestionsInstructor } from '../instructors/AskQuestionsInstructor';
import { OperationDao } from '../../dao/OperationDao';
import { container } from '../../utils/di/container';

export type AgentContext = PlanContext | RouteActionContext | SearchContext;

export abstract class AbstractAction<T extends AgentContext> {
  static readonly description: string;
  static readonly actionEnum: ActionEnum;

  abstract readonly description: string;
  abstract readonly actionEnum: ActionEnum;

  protected agentNode: AgentNode;
  protected agentNodeDao: AgentNodeDao;
  protected isContextSufficientInstructor: IsContextSufficientInstructor;
  protected askQuestionsInstructor: AskQuestionsInstructor;
  protected operationDao: OperationDao;

  constructor(
    agentNode: AgentNode
  ) {
    this.agentNodeDao = container.get(AgentNodeDao);
    this.isContextSufficientInstructor = container.get(IsContextSufficientInstructor);
    this.askQuestionsInstructor = container.get(AskQuestionsInstructor);
    this.operationDao = container.get(OperationDao);
    this.agentNode = agentNode;
  }

  protected abstract getContext(): Promise<T>;

  abstract run(): Promise<void>;

  async submitReport(agentNode: AgentNode, report: string): Promise<AgentNode> {
    if (agentNode.report !== null) {
      throw new Error(
        `Node ${agentNode.id} already has a report: ${agentNode.report}. Cannot update with ${report}.`
      );
    }
    return await this.agentNodeDao.update(agentNode.id, { report });
  }

  async isContextSufficient(content: string): Promise<boolean> {
    const isContextSufficient = await this.isContextSufficientInstructor.run(
      { content, context: this.getMostRecentContextString() ?? undefined },
      this.agentNode.id
    );
    return isContextSufficient.isContextSufficient;
  }

  async askQuestions(content: string): Promise<void> {
    const questions = await this.askQuestionsInstructor.run(
      { content, context: this.getMostRecentContextString() ?? undefined },
      this.agentNode.id
    );

    const questionsString = questions.questions.map(q => `\t- ${q}`).join('\n');
    await this.agentNodeDao.create({
      actionEnum: ActionEnum.SEARCH,
      goal: `Find answers to the following questions:\n${questionsString}`,
      searchContext: {
        create: {
          questions: questions.questions
        }
      },
      agentGraph: { connect: { id: this.agentNode.agentGraphId } }
    });
  }

  getMostRecentContextString(): string | undefined {
    const contextHistory = this.agentNode.stringContextHistory as string[];
    return contextHistory.length > 0 ? contextHistory[contextHistory.length - 1] : undefined;
  }

  protected assertContext<T>(context: T | null | undefined, contextName: string): asserts context is T {
    if (!context) {
      throw new Error(`${contextName} is missing for action ${this.agentNode.id} of type ${this.agentNode.actionEnum}`);
    }
  }
}