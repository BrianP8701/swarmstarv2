import { ActionEnum, PlanContext } from '@prisma/client'
import { AbstractAction } from '../AbstractAction'
import { PlanInstructor } from '../../instructors/PlanInstructor'
import { ReviewPlanInstructor } from '../../instructors/ReviewPlanInstructor'
import { AgentNodeWithContext } from '../../../dao/nodes/AgentNodeDao'
import { container } from '../../../utils/di/container'

const MAX_PLAN_ATTEMPTS = 3

export class PlanAction extends AbstractAction<PlanContext> {
  static readonly description = 'Plan an action based on the current context and goal.'
  static readonly actionEnum = ActionEnum.PLAN

  readonly description = PlanAction.description
  readonly actionEnum = PlanAction.actionEnum

  protected planInstructor: PlanInstructor
  protected reviewPlanInstructor: ReviewPlanInstructor

  constructor(agentNode: AgentNodeWithContext) {
    super(agentNode)
    this.planInstructor = container.get(PlanInstructor)
    this.reviewPlanInstructor = container.get(ReviewPlanInstructor)
  }

  async run(): Promise<void> {
    const isContextSufficient = await this.isContextSufficient(this.agentNode.goal)
    if (!isContextSufficient) {
      await this.askQuestions(this.agentNode.goal)
      return
    }
    await this.generatePlan()
  }

  private async generatePlan(): Promise<void> {
    const context = await this.getContext()
    context.attempts++
    const plan = await this.planInstructor.run(
      {
        goal: this.agentNode.goal,
        context: this.getMostRecentContextString(),
        review: context.planReviewFeedbackHistory[context.planReviewFeedbackHistory.length - 1],
        lastPlanAttempt: context.planAttempts[context.planAttempts.length - 1],
      },
      this.agentNode.id
    )

    const reviewPlan = await this.reviewPlanInstructor.run(
      {
        goal: this.agentNode.goal,
        steps: plan.steps,
        context: this.getMostRecentContextString(),
      },
      this.agentNode.id
    )

    if (reviewPlan.confirmation) {
      await this.spawnNextAction(plan.steps[0])
    } else {
      if (context.attempts < MAX_PLAN_ATTEMPTS) {
        context.planReviewFeedbackHistory.push(reviewPlan.feedback)
        context.planAttempts.push(plan.steps.join('\n'))
        await this.updateContext()
        await this.generatePlan()
      } else {
        throw new Error(`Plan exceeded max attempts on action node ${this.agentNode.id}`)
      }
    }
  }

  private async spawnNextAction(goal: string): Promise<void> {
    await this.agentNodeDao.create({
      actionEnum: ActionEnum.ROUTE_ACTION,
      goal,
      routeActionContext: {
        create: {
          content: goal,
        },
      },
      agentGraph: { connect: { id: this.agentNode.agentGraphId } },
    })
  }

  protected async getContext(): Promise<PlanContext> {
    const agentNodeWithContext = await this.agentNodeDao.getWithContext(this.agentNode.id)
    if (!agentNodeWithContext?.planContext) {
      throw new Error(`Agent node with id ${this.agentNode.id} not found`)
    }
    return agentNodeWithContext.planContext
  }

  private async updateContext(): Promise<void> {
    const context = await this.getContext()
    await this.agentNodeDao.update(this.agentNode.id, {
      planContext: {
        update: {
          attempts: context.attempts,
          planAttempts: context.planAttempts,
          planReviewFeedbackHistory: context.planReviewFeedbackHistory,
        },
      },
    })
  }
}
