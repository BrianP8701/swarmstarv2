import { PrismaClient } from '@prisma/client';
import { seed } from './databaseSeed';
import { exec } from 'child_process';
import util from 'util';
import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logging/logger';

const execPromise = util.promisify(exec);
const prisma = new PrismaClient();

async function resetAndSeed() {
  logger.info('Resetting database...');
  await prisma.$executeRaw`DROP SCHEMA public CASCADE`;
  await prisma.$executeRaw`CREATE SCHEMA public`;
  
  // Delete the migrations folder
  const migrationsPath = path.join(__dirname, '..', '..', 'prisma', 'migrations');
  try {
    await fs.rm(migrationsPath, { recursive: true, force: true });
    logger.info('Migrations folder deleted');
  } catch (error) {
    logger.error('Error deleting migrations folder:', error);
  }

  // Run prisma migrate dev
  logger.info('Running prisma migrate dev...');
  try {
    const { stdout, stderr } = await execPromise('yarn prisma migrate dev --name init --create-only');
    logger.info('Migration output:', stdout);
    if (stderr) logger.error('Migration errors:', stderr);

    // Apply the migration
    const { stdout: applyStdout, stderr: applyStderr } = await execPromise('yarn prisma migrate deploy');
    logger.info('Migration apply output:', applyStdout);
    if (applyStderr) logger.error('Migration apply errors:', applyStderr);
  } catch (error) {
    logger.error('Error running migrations:', error);
    throw error;
  }
  
  // Generate Prisma client
  await execPromise('yarn prisma generate');
  
  // Disconnect and reconnect to ensure the new schema is loaded
  await prisma.$disconnect();
  const newPrismaClient = new PrismaClient();
  
  logger.info('Seeding database...');
  await seed();
  
  logger.info('Database reset and seeded successfully');
  
  await newPrismaClient.$disconnect();
}

resetAndSeed()
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  });
