import { ActionNode, ActionEnum, PlanContext, RouteActionContext, SearchContext } from '@prisma/client';
import { ActionDao, ActionNodeWithContext } from '../../dao/nodes/ActionDao';
import { IsContextSufficientInstructor } from '../instructors/IsContextSufficientInstructor';
import { AskQuestionsInstructor } from '../instructors/AskQuestionsInstructor';
import { OperationDao } from '../../dao/OperationDao';
import { container } from '../../utils/di/container';

export type ActionContext = PlanContext | RouteActionContext | SearchContext;

export abstract class AbstractAction<T extends ActionContext> {
  static readonly description: string;
  static readonly actionEnum: ActionEnum;

  abstract readonly description: string;
  abstract readonly actionEnum: ActionEnum;

  protected actionNode: ActionNodeWithContext;
  protected actionDao: ActionDao;
  protected isContextSufficientInstructor: IsContextSufficientInstructor;
  protected askQuestionsInstructor: AskQuestionsInstructor;
  protected operationDao: OperationDao;
  protected context: T;

  constructor(
    actionNode: ActionNodeWithContext
  ) {
    this.actionDao = container.get(ActionDao);
    this.isContextSufficientInstructor = container.get(IsContextSufficientInstructor);
    this.askQuestionsInstructor = container.get(AskQuestionsInstructor);
    this.operationDao = container.get(OperationDao);
    this.actionNode = actionNode;
    this.context = this.getContext();
  }

  protected abstract getContext(): T;

  abstract run(): Promise<void>;

  async submitReport(actionNode: ActionNode, report: string): Promise<ActionNode> {
    if (actionNode.report !== null) {
      throw new Error(
        `Node ${actionNode.id} already has a report: ${actionNode.report}. Cannot update with ${report}.`
      );
    }
    return await this.actionDao.update(actionNode.id, { report });
  }

  async isContextSufficient(content: string): Promise<boolean> {
    const isContextSufficient = await this.isContextSufficientInstructor.run(
      { content, context: this.getMostRecentContextString() ?? undefined },
      this.actionNode.id
    );
    return isContextSufficient.isContextSufficient;
  }

  async askQuestions(content: string): Promise<void> {
    const questions = await this.askQuestionsInstructor.run(
      { content, context: this.getMostRecentContextString() ?? undefined },
      this.actionNode.id
    );

    const questionsString = questions.questions.map(q => `\t- ${q}`).join('\n');
    await this.actionDao.create({
      actionEnum: ActionEnum.SEARCH,
      goal: `Find answers to the following questions:\n${questionsString}`,
      searchContext: {
        create: {
          questions: questions.questions
        }
      },
      swarm: { connect: { id: this.actionNode.swarmId } }
    });
  }

  getMostRecentContextString(): string | undefined {
    const contextHistory = this.actionNode.stringContextHistory as string[];
    return contextHistory.length > 0 ? contextHistory[contextHistory.length - 1] : undefined;
  }

  protected assertContext<T>(context: T | null | undefined, contextName: string): asserts context is T {
    if (!context) {
      throw new Error(`${contextName} is missing for action ${this.actionNode.id} of type ${this.actionNode.actionEnum}`);
    }
  }
}