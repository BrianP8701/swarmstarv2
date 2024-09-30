import { z } from 'zod'
import { AbstractInstructor } from './AbstractInstructor'
import { InstructorMessage } from '../../services/InstructorService'

const ChainOfThoughtInstructorSchema = z.object({
  chainOfThought: z.string().describe('Think here if beneficial for responding to the user.'),
  response: z.string().describe('Provide the final response to the given task.'),
})

type ChainOfThoughtInstructorInput = {
  conversation: InstructorMessage[]
}

export class ChainOfThoughtInstructor extends AbstractInstructor<
  typeof ChainOfThoughtInstructorSchema,
  ChainOfThoughtInstructorInput
> {
  ZodSchema = ChainOfThoughtInstructorSchema

  protected writeInstructions({ conversation }: ChainOfThoughtInstructorInput): InstructorMessage[] {
    return conversation
  }
}
