import { ActionEnum, PlanContext } from '@prisma/client'
import { AbstractAction } from '../AbstractAction'
import { PlanInstructor } from '../../instructors/PlanInstructor'
import { ReviewPlanInstructor } from '../../instructors/ReviewPlanInstructor'
import { ActionNodeWithContext } from '../../../dao/nodes/ActionDao'
import { container } from '../../../utils/di/container'

const MAX_PLAN_ATTEMPTS = 3

export class PlanAction extends AbstractAction<PlanContext> {
  static readonly id = 'plan';
  static readonly description = "Plan an action based on the current context and goal.";
  static readonly actionEnum = ActionEnum.PLAN;

  readonly id = PlanAction.id;
  readonly description = PlanAction.description;
  readonly actionEnum = PlanAction.actionEnum;

  protected planInstructor: PlanInstructor
  protected reviewPlanInstructor: ReviewPlanInstructor

  constructor(actionNode: ActionNodeWithContext) {
    super(actionNode)
    this.planInstructor = container.get(PlanInstructor)
    this.reviewPlanInstructor = container.get(ReviewPlanInstructor)
  }

  async run(): Promise<void> {
    const isContextSufficient = await this.isContextSufficient(this.actionNode.goal)
    if (!isContextSufficient) {
      await this.askQuestions(this.actionNode.goal)
      return
    }
    await this.generatePlan()
  }

  private async generatePlan(): Promise<void> {
    this.context.attempts++
    const plan = await this.planInstructor.run(
      {
        goal: this.actionNode.goal,
        context: this.getMostRecentContextString(),
        review: this.getContext().planReviewFeedbackHistory[this.getContext().planReviewFeedbackHistory.length - 1],
        lastPlanAttempt: this.getContext().planAttempts[this.getContext().planAttempts.length - 1],
      },
      this.actionNode.id
    )

    const reviewPlan = await this.reviewPlanInstructor.run(
      {
        goal: this.actionNode.goal,
        steps: plan.steps,
        context: this.getMostRecentContextString(),
      },
      this.actionNode.id
    )

    if (reviewPlan.confirmation) {
      await this.spawnNextAction(plan.steps[0])
    } else {
      if (this.context.attempts < MAX_PLAN_ATTEMPTS) {
        this.context.planReviewFeedbackHistory.push(reviewPlan.feedback)
        this.context.planAttempts.push(plan.steps.join('\n'))
        await this.updateContext()
        await this.generatePlan()
      } else {
        throw new Error(`Plan exceeded max attempts on action node ${this.actionNode.id}`)
      }
    }
  }

  private async spawnNextAction(goal: string): Promise<void> {
    await this.actionDao.create(this.actionNode.swarmId, {
      actionEnum: ActionEnum.ROUTE_ACTION,
      goal,
      routeActionContext: {
        create: {
          content: goal,
        }
      },
      swarm: { connect: { id: this.actionNode.swarmId } }
    });
  }

  protected getContext(): PlanContext {
    return this.actionNode.planContext
  }

  private async updateContext(): Promise<void> {
    await this.actionDao.update(this.actionNode.id, {
      planContext: {
        update: {
          attempts: this.getContext().attempts,
          planAttempts: this.getContext().planAttempts,
          planReviewFeedbackHistory: this.getContext().planReviewFeedbackHistory,
        }
      }
    })
  }
}