import { Prisma } from '@prisma/client';
import { BlockingOperation, FunctionCallOperation, TerminationOperation } from "@prisma/client";

export type SwarmOperation = 
TerminationOperation | 
BlockingOperation | 
FunctionCallOperation

interface DatabaseMapEntry {
  abbreviation?: string;
  countColumn?: Prisma.SwarmScalarFieldEnum;
}

export const DATABASE_MAP: Record<Prisma.ModelName, DatabaseMapEntry> = {
  ActionMetadataNode: {
    abbreviation: "am",
    countColumn: Prisma.SwarmScalarFieldEnum.actionMetadataNodeCount
  },
  MemoryNode: {
    abbreviation: "mm",
    countColumn: Prisma.SwarmScalarFieldEnum.memoryCount
  },
  TerminationOperation: {
    abbreviation: "to",
    countColumn: Prisma.SwarmScalarFieldEnum.terminationOperationCount
  },
  FunctionCallOperation: {
    abbreviation: "fc",
    countColumn: Prisma.SwarmScalarFieldEnum.functionCallOperationCount
  },
  ToolMetadataNode: {
    abbreviation: "tm",
    countColumn: Prisma.SwarmScalarFieldEnum.toolMetadataNodeCount
  },
  ActionNode: {
    abbreviation: "an",
    countColumn: Prisma.SwarmScalarFieldEnum.actionCount
  },
  BlockingOperation: {
    abbreviation: "bo",
    countColumn: Prisma.SwarmScalarFieldEnum.blockingOperationCount
  },
  User: {},
  Swarm: {},
  Chat: {},
  Message: {},
  PlanContext: {},
  RouteActionContext: {},
  SearchContext: {},
};

export const TABLE_ENUM_TO_ABBREVIATION = Object.fromEntries(
  Object.entries(DATABASE_MAP).map(([key, value]) => [key, value.abbreviation])
);

export const TABLE_ABBREVIATION_TO_ENUM = Object.fromEntries(
  Object.entries(DATABASE_MAP)
    .filter(([, value]) => value.abbreviation)
    .map(([key, value]) => [value.abbreviation, key])
);

export const TABLE_ENUM_TO_SWARMSTAR_SPACE_COUNT_COLUMN = Object.fromEntries(
  Object.entries(DATABASE_MAP).map(([key, value]) => [key, value.countColumn])
);
