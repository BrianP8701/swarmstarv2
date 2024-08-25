import Instructor from '@instructor-ai/instructor'
import { inject, injectable, named } from 'inversify'
import OpenAI from 'openai'
import { z } from 'zod'
import { TYPES } from '../utils/di/container'
import { ContextLogger } from '../utils/logging/ContextLogger'
import { ActionDao } from '../dao/ActionDao'

export type GPT_MODEL = 'gpt-3.5-turbo' | 'gpt-4-1106-preview' | 'gpt-4-turbo-preview' | 'gpt-4o' | 'gpt-4o-mini'

export enum InstructorMessageRoleEnum {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export type InstructorMessage = { 
  role: InstructorMessageRoleEnum
  content: string
}

export type InstructorConversation = InstructorMessage[]

export type InstructorRequest = {
  messages: InstructorConversation
  response_model: {
    schema: z.AnyZodObject
    name: string
  }
  max_retries?: number
  model?: GPT_MODEL
  temperature?: number
  action_id?: string
}

@injectable()
export class InstructorService {
  constructor(
    @inject(OpenAI) private openAI: OpenAI,
    @inject(TYPES.Logger) @named('InstructorClient') private logger: ContextLogger,
    @inject(ActionDao) private actionDao: ActionDao
  ) {}

  public async run<T extends z.AnyZodObject>(request: InstructorRequest): Promise<z.infer<T>> {
    const timeoutPromise = new Promise<'timeout'>(resolve => {
      setTimeout(() => {
        resolve('timeout')
      }, 300000) // 300 seconds
    })

    const client = Instructor({
      client: this.openAI,
      mode: 'FUNCTIONS',
    })

    this.logger.info('Creating OpenAI Instructor request')
    const responsePromise = client.chat.completions.create({
      messages: request.messages,
      model: request.model ?? 'gpt-4o',
      temperature: request.temperature ?? 0,
      response_model: {
        schema: request.response_model.schema,
        name: request.response_model.name
      },
      max_retries: request.max_retries ?? 3,
    })

    const result = await Promise.race([responsePromise, timeoutPromise])

    if (result === 'timeout') {
      throw new Error('Timeout during OpenAI Instructor request')
    }

    if (request.action_id) {
      await this.actionDao.log(request.action_id, [...request.messages.map(message => message.content), JSON.stringify(result)])
    }
    return result
  }
}
