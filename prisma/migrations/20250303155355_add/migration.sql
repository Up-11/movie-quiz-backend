/*
  Warnings:

  - A unique constraint covering the columns `[correctAnswerId]` on the table `Question` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "correctAnswerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Question_correctAnswerId_key" ON "Question"("correctAnswerId");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_correctAnswerId_fkey" FOREIGN KEY ("correctAnswerId") REFERENCES "AnswerVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
