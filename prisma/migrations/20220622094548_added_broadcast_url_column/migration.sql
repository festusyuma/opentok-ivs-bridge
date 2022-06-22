/*
  Warnings:

  - Added the required column `broadcastUrl` to the `Broadcast` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Broadcast" ADD COLUMN     "broadcastUrl" TEXT NOT NULL;
