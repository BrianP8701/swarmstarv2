import { z } from 'zod'
import { AbstractInstructor } from './AbstractInstructor'
import { InstructorMessage, InstructorMessageRoleEnum } from '../../services/InstructorService'

const PlanInstructorSchema = z.object({
  steps: z.array(z.string()).describe('Break the goal into actionable steps that must be executed in sequence.'),
})

type PlanInstructorInput = {
  goal: string
  context?: string
  review?: string
  lastPlanAttempt?: string
}

export class PlanInstructor extends AbstractInstructor<typeof PlanInstructorSchema, PlanInstructorInput> {
  ZodSchema = PlanInstructorSchema

  protected writeInstructions({ goal, context, review, lastPlanAttempt }: PlanInstructorInput): InstructorMessage[] {
    const messages: InstructorMessage[] = [
      {
        role: InstructorMessageRoleEnum.USER,
        content: `The goal is: ${goal}. Please break it down into  steps.${context ? `\n\nContext: ${context}` : ''}`,
      },
    ]

    if (lastPlanAttempt && review) {
      messages.push({
        role: InstructorMessageRoleEnum.USER,
        content: `The last plan attempt was: ${JSON.stringify(lastPlanAttempt)}. It did not pass review, here is the feedback: ${review}.`,
      })
    }

    return messages
  }
}
