import { ActionNode, ActionEnum } from '@prisma/client';
import { inject } from 'inversify';
import { ActionDao } from '../../dao/ActionDao';
import { IsContextSufficientInstructor } from '../instructors/IsContextSufficientInstructor';
import { AskQuestionsInstructor } from '../instructors/AskQuestionsInstructor';
import { OperationDao } from '../../dao/OperationDao';
import { QuestionContextSchema } from '../../constants/actionConstants';

export abstract class AbstractAction {
  protected actionNode: ActionNode;

  constructor(
    @inject(ActionDao) private actionDao: ActionDao,
    @inject(IsContextSufficientInstructor) private isContextSufficientInstructor: IsContextSufficientInstructor,
    @inject(AskQuestionsInstructor) private askQuestionsInstructor: AskQuestionsInstructor,
    @inject(OperationDao) private operationDao: OperationDao,
    actionNode: ActionNode
  ) {
    this.actionNode = actionNode;
  }

  abstract run(): Promise<void>;

  async submitReport(actionNode: ActionNode, report: string): Promise<ActionNode> {
    if (actionNode.report !== null) {
      throw new Error(
        `Node ${actionNode.id} already has a report: ${actionNode.report}. Cannot update with ${report}.`
      );
    }
    return await this.actionDao.update(actionNode.id, actionNode.actionEnum, { report });
  }

  async isContextSufficient(content: string): Promise<boolean> {
    const isContextSufficient = await this.isContextSufficientInstructor.run(
      { content, context: this.getMostRecentContext() ?? undefined },
      this.actionNode.id
    );
    return isContextSufficient.isContextSufficient;
  }

  async askQuestions(content: string): Promise<void> {
    const questions = await this.askQuestionsInstructor.run(
      { content, context: this.getMostRecentContext() ?? undefined },
      this.actionNode.id
    );

    const questionsString = questions.questions.map(q => `\t- ${q}`).join('\n');
    await this.operationDao.createSpawnOperation(this.actionNode.swarmId, {
      actionEnum: ActionEnum.SEARCH,
      actionNode: { connect: { id: this.actionNode.id } },
      goal: `Find answers to the following questions:\n${questionsString}`,
      context: QuestionContextSchema.parse(this.getMostRecentContext())
    });
  }

  getMostRecentContext(): string | null {
    const contextHistory = this.actionNode.stringContextHistory as string[];
    return contextHistory.length > 0 ? contextHistory[contextHistory.length - 1] : null;
  }
}
