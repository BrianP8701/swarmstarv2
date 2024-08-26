import { z } from 'zod';
import { AbstractInstructor } from './AbstractInstructor';
import { InstructorConversation, InstructorMessageRoleEnum } from '../../services/external/InstructorService';

const ReviewPlanInstructorSchema = z.object({
  analysis: z.string().describe("Analyze the list of steps and determine if they can be executed in sequence or if they should be revised."),
  confirmation: z.boolean().describe("After analysis, conclusively provide a confirmation of whether the steps can be executed in sequence or if they need to be revised. If they can be executed in sequence, output 'true'. If they need to be revised, output 'false'."),
  feedback: z.string().describe("Provide feedback on why the steps cannot be executed in sequence. This feedback should be actionable and specific to the steps that need to be revised."),
});

type ReviewPlanInstructorInput = {
  goal: string;
  steps: string[];
  context?: string;
};

export class ReviewPlanInstructor extends AbstractInstructor<
  typeof ReviewPlanInstructorSchema,
  ReviewPlanInstructorInput
> {
  ZodSchema = ReviewPlanInstructorSchema;

  protected writeInstructions({ goal, steps, context }: ReviewPlanInstructorInput): InstructorConversation {
    return [
      {
        role: InstructorMessageRoleEnum.USER,
        content: `The steps are: ${JSON.stringify(steps)}. Please analyze if they must be executed in sequence.${context ? `\n\nContext: ${context}` : ''}`,
      },
    ];
  }
}
