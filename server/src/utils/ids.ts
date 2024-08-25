import { DATABASE_MAP, TABLE_ABBREVIATION_TO_ENUM, TABLE_ENUM_TO_ABBREVIATION, TABLE_ENUM_TO_SWARMSTAR_SPACE_COUNT_COLUMN } from '../constants/databaseConstants'
import { container } from './di/container'
import { SwarmDao } from '../dao/SwarmDao'
import { Prisma } from '@prisma/client'
import { SWARM_ID_LENGTH } from '../constants/stringConstants'

export async function generateId(
  table: Prisma.ModelName,
  swarmId: string
): Promise<string> {
  const swarmDao = container.get(SwarmDao)

  const databaseMapEntry = DATABASE_MAP[table]

  const countColumnName = databaseMapEntry?.countColumn
  const identifier = databaseMapEntry?.abbreviation

  if (countColumnName && identifier) {
    const x = await swarmDao.getAndIncrementSwarmObjectCount(swarmId, countColumnName)
    return `${swarmId}_${identifier}${x}`
  } else {
    throw new Error(`No count column found for table ${table}`)
  }
}

export async function getAllSwarmObjectIds(
  swarmId: string,
  table: Prisma.ModelName
): Promise<string[] | null> {
  const swarmDao = container.get(SwarmDao)
  const countColumnName = TABLE_ENUM_TO_SWARMSTAR_SPACE_COUNT_COLUMN[table]
  if (!countColumnName) {
    return null
  }
  const x = await swarmDao.getSwarmObjectCount(swarmId, countColumnName)
  return Array.from({ length: x }, (_, i) => `${swarmId}_${TABLE_ENUM_TO_ABBREVIATION[table]}${i}`)
}

export function extractSwarmId(id: string): string {
  return id.slice(0, SWARM_ID_LENGTH)
}

export function getTableEnumFromId(id: string): Prisma.ModelName {
  const tableIdentifier = id.slice(SWARM_ID_LENGTH + 2, SWARM_ID_LENGTH + 4)
  return TABLE_ABBREVIATION_TO_ENUM[tableIdentifier]
}
