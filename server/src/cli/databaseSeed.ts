import { generateActionMetadataTree } from './generateActionMetadata';
import { UserDao } from '../dao/UserDao';
import { container } from '../utils/di/container';

export async function seed() {
  // Generate action metadata

  // Create user with specific ID
  const userDao = container.get(UserDao);
  const userId = process.env.SEED_USER_ID;

  if (!userId) {
    throw new Error('SEED_USER_ID environment variable is not set');
  }

  const user = await userDao.create({
    clerkId: userId,
  });

  await generateActionMetadataTree(user.id);

  console.log(`Created seed user with ID: ${user.id}`);
}

// Add this for CLI execution
if (require.main === module) {
  seed().catch(console.error);
}
