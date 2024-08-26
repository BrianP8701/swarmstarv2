import { PrismaClient } from '@prisma/client';
import { seed } from './databaseSeed';
import { exec } from 'child_process';
import util from 'util';
import fs from 'fs/promises';
import path from 'path';

const execPromise = util.promisify(exec);
const prisma = new PrismaClient();

async function resetAndSeed() {
  console.log('Resetting database...');
  await prisma.$executeRaw`DROP SCHEMA public CASCADE`;
  await prisma.$executeRaw`CREATE SCHEMA public`;
  
  // Delete the migrations folder
  const migrationsPath = path.join(__dirname, '..', '..', 'prisma', 'migrations');
  try {
    await fs.rm(migrationsPath, { recursive: true, force: true });
    console.log('Migrations folder deleted');
  } catch (error) {
    console.error('Error deleting migrations folder:', error);
  }

  // Run prisma migrate dev
  console.log('Running prisma migrate dev...');
  try {
    const { stdout, stderr } = await execPromise('yarn prisma migrate dev --name init --create-only');
    console.log('Migration output:', stdout);
    if (stderr) console.error('Migration errors:', stderr);

    // Apply the migration
    const { stdout: applyStdout, stderr: applyStderr } = await execPromise('yarn prisma migrate deploy');
    console.log('Migration apply output:', applyStdout);
    if (applyStderr) console.error('Migration apply errors:', applyStderr);
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  }
  
  // Generate Prisma client
  await execPromise('yarn prisma generate');
  
  // Disconnect and reconnect to ensure the new schema is loaded
  await prisma.$disconnect();
  const newPrismaClient = new PrismaClient();
  
  console.log('Seeding database...');
  await seed();
  
  console.log('Database reset and seeded successfully');
  
  await newPrismaClient.$disconnect();
}

resetAndSeed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
