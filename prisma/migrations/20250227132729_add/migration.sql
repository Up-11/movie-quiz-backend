/*
  Warnings:

  - Added the required column `correctAnswers` to the `UserQuizCompletion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `failedAnswers` to the `UserQuizCompletion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserQuizCompletion" ADD COLUMN     "correctAnswers" INTEGER NOT NULL,
ADD COLUMN     "failedAnswers" INTEGER NOT NULL;
