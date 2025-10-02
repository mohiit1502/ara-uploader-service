/*
  Warnings:

  - You are about to drop the `Board` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaskList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Board" DROP CONSTRAINT "Board_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_boardId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_taskListId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TaskList" DROP CONSTRAINT "TaskList_boardId_fkey";

-- DropTable
DROP TABLE "public"."Board";

-- DropTable
DROP TABLE "public"."Task";

-- DropTable
DROP TABLE "public"."TaskList";

-- DropEnum
DROP TYPE "public"."Status";

-- CreateTable
CREATE TABLE "public"."Image" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "s3Key" TEXT NOT NULL,
    "s3Url" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "metaUrl" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "secure" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hash" TEXT,
    "userId" TEXT,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);
