/*
  Warnings:

  - Added the required column `broadcastChannel` to the `Broadcast` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Broadcast" ADD COLUMN     "broadcastChannel" TEXT NOT NULL;
