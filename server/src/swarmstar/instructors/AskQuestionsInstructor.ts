import { z } from 'zod';
import { AbstractInstructor } from './AbstractInstructor';
import { InstructorConversation } from '../../services/external/InstructorService';
import { InstructorMessageRoleEnum } from '../../services/external/InstructorService';

const QuestionInstructorSchema = z.object({
  questions: z.array(z.string()).describe("It seems like we need more information to do this. Ask questions to get more information."),
  context: z.string().describe("If applicable, provide context for the questions."),
});

type AskQuestionsInstructorInput = {
  content: string;
  context?: string;
};

export class AskQuestionsInstructor extends AbstractInstructor<
  typeof QuestionInstructorSchema,
  AskQuestionsInstructorInput
> {
  ZodSchema = QuestionInstructorSchema;

  protected writeInstructions({ content, context }: AskQuestionsInstructorInput): InstructorConversation {
    return [
      {
        role: InstructorMessageRoleEnum.SYSTEM,
        content: "Ask questions to gather the necessary information. Provide relevant context with each question, and include any general context in the dedicated context section.",
      },
      {
        role: InstructorMessageRoleEnum.USER,
        content: `What we need to do: ${content}${context ? `\n\nContext: ${context}` : ''}`,
      },
    ];
  }
}