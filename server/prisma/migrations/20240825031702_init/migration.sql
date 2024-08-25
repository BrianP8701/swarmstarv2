-- CreateEnum
CREATE TYPE "OperationStatusEnum" AS ENUM ('CREATED', 'QUEUED', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "MessageRoleEnum" AS ENUM ('USER', 'SYSTEM', 'ASSISTANT', 'SWARMSTAR');

-- CreateEnum
CREATE TYPE "ActionEnum" AS ENUM ('FOLDER', 'PARALLEL_PLAN', 'SEQUENTIAL_PLAN', 'ROUTE_ACTION', 'CODE', 'SEARCH', 'REVIEW_GOAL_PROGRESS');

-- CreateEnum
CREATE TYPE "ActionStatusEnum" AS ENUM ('ACTIVE', 'WAITING_FOR_USER_INPUT', 'TERMINATED', 'PAUSED', 'ERROR');

-- CreateEnum
CREATE TYPE "TerminationPolicyEnum" AS ENUM ('SIMPLE', 'CONFIRM_DIRECTIVE_COMPLETION', 'CUSTOM_TERMINATION_HANDLER');

-- CreateEnum
CREATE TYPE "BlockingOperationEnum" AS ENUM ('SEND_USER_MESSAGE', 'INSTRUCTOR_CALL', 'CHATGPT_CALL');

-- CreateEnum
CREATE TYPE "DatabaseTableEnum" AS ENUM ('ACTION_NODES', 'SWARMSTAR_SPACE', 'SWARMSTAR_EVENTS', 'ACTION_METADATA_NODES', 'MEMORY_METADATA_NODES', 'TOOL_METADATA_NODES', 'SPAWN_OPERATIONS', 'TERMINATION_OPERATIONS', 'BLOCKING_OPERATIONS', 'COMMUNICATION_OPERATIONS', 'FUNCTION_CALL_OPERATIONS', 'MESSAGES', 'USERS');

-- CreateEnum
CREATE TYPE "SwarmStatusEnum" AS ENUM ('SPAWNING', 'ACTIVE', 'WAITING_FOR_USER_INPUT', 'COMPLETED', 'PAUSED', 'ERROR');

-- CreateEnum
CREATE TYPE "ToolTypeEnum" AS ENUM ('GITHUB_CLONE');

-- CreateEnum
CREATE TYPE "MemoryTypeEnum" AS ENUM ('FOLDER', 'GITHUB_REPOSITORY_LINK', 'PYTHON_FILE', 'TYPESCRIPT_FILE', 'STRING');

-- CreateTable
CREATE TABLE "User" (
    "id" VARCHAR(255) NOT NULL,
    "stripeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Swarm" (
    "id" UUID NOT NULL,
    "goal" TEXT,
    "title" TEXT,
    "status" "SwarmStatusEnum" NOT NULL DEFAULT 'WAITING_FOR_USER_INPUT',
    "actionNodeCount" INTEGER,
    "memoryNodeCount" INTEGER,
    "spawnOperationCount" INTEGER,
    "terminationOperationCount" INTEGER,
    "blockingOperationCount" INTEGER,
    "communicationOperationCount" INTEGER,
    "functionCallOperationCount" INTEGER,
    "userId" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Swarm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "userId" VARCHAR(255) NOT NULL,
    "actionNodeId" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "role" "MessageRoleEnum" NOT NULL,
    "chatId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpawnOperation" (
    "id" VARCHAR(255) NOT NULL,
    "goal" TEXT,
    "actionEnum" "ActionEnum" NOT NULL,
    "context" JSONB,
    "actionNodeId" VARCHAR(255) NOT NULL,
    "status" "OperationStatusEnum" NOT NULL DEFAULT 'CREATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpawnOperation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FunctionCallOperation" (
    "id" VARCHAR(255) NOT NULL,
    "functionToCall" TEXT NOT NULL,
    "actionNodeId" VARCHAR(255) NOT NULL,
    "status" "OperationStatusEnum" NOT NULL DEFAULT 'CREATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FunctionCallOperation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TerminationOperation" (
    "id" VARCHAR(255) NOT NULL,
    "terminatorId" TEXT NOT NULL,
    "actionNodeId" VARCHAR(255) NOT NULL,
    "status" "OperationStatusEnum" NOT NULL DEFAULT 'CREATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TerminationOperation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockingOperation" (
    "id" VARCHAR(255) NOT NULL,
    "nextFunctionToCall" TEXT NOT NULL,
    "args" JSONB,
    "blockingOperationEnum" "BlockingOperationEnum" NOT NULL,
    "actionNodeId" VARCHAR(255) NOT NULL,
    "status" "OperationStatusEnum" NOT NULL DEFAULT 'CREATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlockingOperation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionNode" (
    "id" VARCHAR(255) NOT NULL,
    "goal" TEXT NOT NULL,
    "status" "ActionStatusEnum" NOT NULL DEFAULT 'ACTIVE',
    "terminationPolicyEnum" "TerminationPolicyEnum" NOT NULL DEFAULT 'SIMPLE',
    "report" TEXT,
    "stringContextHistory" JSONB DEFAULT '[]',
    "context" JSONB,
    "actionEnum" "ActionEnum" NOT NULL,
    "parentId" VARCHAR(255),
    "swarmId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActionNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemoryNode" (
    "id" VARCHAR(255) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "memoryType" "MemoryTypeEnum" NOT NULL,
    "parentId" VARCHAR(255),
    "swarmId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemoryNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolMetadataNode" (
    "id" VARCHAR(255) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "parentId" TEXT,
    "toolType" "ToolTypeEnum" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ToolMetadataNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionMetadataNode" (
    "id" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "actionEnum" "ActionEnum" NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActionMetadataNode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Swarm" ADD CONSTRAINT "Swarm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_actionNodeId_fkey" FOREIGN KEY ("actionNodeId") REFERENCES "ActionNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpawnOperation" ADD CONSTRAINT "SpawnOperation_actionNodeId_fkey" FOREIGN KEY ("actionNodeId") REFERENCES "ActionNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FunctionCallOperation" ADD CONSTRAINT "FunctionCallOperation_actionNodeId_fkey" FOREIGN KEY ("actionNodeId") REFERENCES "ActionNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TerminationOperation" ADD CONSTRAINT "TerminationOperation_actionNodeId_fkey" FOREIGN KEY ("actionNodeId") REFERENCES "ActionNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockingOperation" ADD CONSTRAINT "BlockingOperation_actionNodeId_fkey" FOREIGN KEY ("actionNodeId") REFERENCES "ActionNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionNode" ADD CONSTRAINT "ActionNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ActionNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionNode" ADD CONSTRAINT "ActionNode_swarmId_fkey" FOREIGN KEY ("swarmId") REFERENCES "Swarm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemoryNode" ADD CONSTRAINT "MemoryNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "MemoryNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemoryNode" ADD CONSTRAINT "MemoryNode_swarmId_fkey" FOREIGN KEY ("swarmId") REFERENCES "Swarm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolMetadataNode" ADD CONSTRAINT "ToolMetadataNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ToolMetadataNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionMetadataNode" ADD CONSTRAINT "ActionMetadataNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ActionMetadataNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
