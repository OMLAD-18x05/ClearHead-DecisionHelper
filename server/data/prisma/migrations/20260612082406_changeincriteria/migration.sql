/*
  Warnings:

  - You are about to drop the column `weight` on the `Criteria` table. All the data in the column will be lost.
  - Added the required column `priority` to the `Criteria` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Criteria" DROP COLUMN "weight",
ADD COLUMN     "priority" INTEGER NOT NULL;
