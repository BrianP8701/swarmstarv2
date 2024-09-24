import { z } from 'zod';
import { InstructorMessage, InstructorService } from '../../services/InstructorService';
import { inject } from 'inversify';

export abstract class AbstractInstructor<ZodSchema extends z.AnyZodObject, TInstructorInput> {
  abstract ZodSchema: ZodSchema;

  constructor(
    @inject(InstructorService) private instructorService: InstructorService
  ) { }

  protected abstract writeInstructions(args: TInstructorInput): InstructorMessage[];

  protected parseOutput?(output: z.infer<ZodSchema>): z.infer<ZodSchema>;

  async run(args: TInstructorInput, actionId?: string): Promise<z.infer<ZodSchema>> {
    const conversation = this.writeInstructions(args);
    let result = await this.instructorService.run(
      {
        messages: conversation,
        response_model: {
          schema: this.ZodSchema,
          name: this.constructor.name,
        },
        action_id: actionId,
      }
    );

    if (this.parseOutput) {
      result = this.parseOutput(result);
    }

    return result;
  }
}