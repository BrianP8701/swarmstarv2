import { z } from 'zod';
import { AbstractInstructor } from './AbstractInstructor';
import { InstructorConversation } from '../../services/external/InstructorService';
import { InstructorMessageRoleEnum } from '../../services/external/InstructorService';

const IsContextSufficientInstructorSchema = z.object({
  isContextSufficient: z.boolean().describe("Do we have enough information to do what we need to do?"),
});

type IsContextSufficientInstructorInput = {
  content: string;
  context?: string;
};

export class IsContextSufficientInstructor extends AbstractInstructor<
  typeof IsContextSufficientInstructorSchema,
  IsContextSufficientInstructorInput
> {
  ZodSchema = IsContextSufficientInstructorSchema;

  protected writeInstructions({ content, context }: IsContextSufficientInstructorInput): InstructorConversation {
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
