import { generateActionMetadataTree } from './generateActionMetadata'
import { UserDao } from '../dao/UserDao'
import { container } from '../utils/di/container'
import { logger } from '../utils/logging/logger'
import { SecretService } from '../services/SecretService'

export async function seed() {
  // Generate action metadata

  // Create user with specific ID
  const userDao = container.get(UserDao)
  const secretService = container.get(SecretService)
  const userId = secretService.getEnvVars().SEED_USER_ID

  if (!userId) {
    throw new Error('SEED_USER_ID environment variable is not set')
  }

  const user = await userDao.create({
    clerkId: userId,
  })
  logger.info(`Created seed user with ID: ${user.id}`)

  await generateActionMetadataTree()
}

// Add this for CLI execution
if (require.main === module) {
  seed().catch(logger.error)
}
