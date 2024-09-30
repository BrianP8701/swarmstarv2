import { z } from 'zod'
import { AbstractInstructor } from './AbstractInstructor'
import { InstructorMessage, InstructorMessageRoleEnum } from '../../services/InstructorService'

const RouterInstructorSchema = z.object({
  bestOption: z.number().nullable().describe('The index of the best option. None if there is no viable option.'),
  unviableOptions: z.array(z.number()).describe('The indices of the options that are unviable'),
})

type RouterInstructorInput = {
  options: string[]
  content: string
  systemMessage: string
}

export class RouterInstructor extends AbstractInstructor<typeof RouterInstructorSchema, RouterInstructorInput> {
  ZodSchema = RouterInstructorSchema

  protected writeInstructions({ options, content, systemMessage }: RouterInstructorInput): InstructorMessage[] {
    const formattedOptions = this.formatOptions(options, content)
    return [
      {
        role: InstructorMessageRoleEnum.SYSTEM,
        content: `${systemMessage}\n\n`,
      },
      {
        role: InstructorMessageRoleEnum.USER,
        content: `Message to be routed: ${content}\n\nOptions:\n${formattedOptions}`,
      },
    ]
  }

  protected parseOutput(output: z.infer<typeof RouterInstructorSchema>): z.infer<typeof RouterInstructorSchema> {
    if (output.bestOption !== null) {
      output.bestOption -= 1
    }
    output.unviableOptions = output.unviableOptions.map(opt => opt - 1)
    return output
  }

  private formatOptions(options: string[], prompt: string): string {
    return `Prompt: ${prompt}\nOptions:\n${options.map((option, i) => `${i + 1}. ${option}`).join('\n')}`
  }
}
