import { z } from 'zod';
import { AbstractInstructor } from './AbstractInstructor';
import { InstructorMessage, InstructorMessageRoleEnum } from '../../services/InstructorService';
import { injectable } from 'inversify';

const IsContextSufficientInstructorSchema = z.object({
  isContextSufficient: z.boolean().describe("Do we have enough information to do what we need to do?"),
});

type IsContextSufficientInstructorInput = {
  content: string;
  context?: string;
};

@injectable()
export class IsContextSufficientInstructor extends AbstractInstructor<
  typeof IsContextSufficientInstructorSchema,
  IsContextSufficientInstructorInput
> {
  ZodSchema = IsContextSufficientInstructorSchema;

  protected writeInstructions({ content, context }: IsContextSufficientInstructorInput): InstructorMessage[] {
    const userContent = `What we need to do: ${content}${context ? `\n\nContext: ${context}` : ''}`;

    return [
      {
        role: InstructorMessageRoleEnum.SYSTEM,
        content: "Determine if we have enough information to do what we need to do.",
      },
      {
        role: InstructorMessageRoleEnum.USER,
        content: userContent,
      },
    ];
  }
}
