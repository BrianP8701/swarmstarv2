import 'reflect-metadata'
import { logger } from '../utils/logging/logger'
import { ChainOfThoughtInstructor } from '../swarmstar/instructors/ChainOfThoughtInstructor'
import { container } from '../utils/di/container'
import { InstructorMessageRoleEnum } from '../services/InstructorService'

const script = async () => {
  const chainOfThoughtInstructor = container.get(ChainOfThoughtInstructor)
  const conversation = [
    {
      role: InstructorMessageRoleEnum.USER,
      content: 'What is the capital of the moon?',
    },
  ]
  const response = await chainOfThoughtInstructor.run({ conversation })
  console.log(response)
}

script()
  .then(() => {
    process.exit(0)
  })
  .catch(error => {
    logger.error('Unexpected error', { cause: error })
    process.exit(1)
  })
