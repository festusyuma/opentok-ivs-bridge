/*
  Warnings:

  - You are about to drop the column `token` on the `Token` table. All the data in the column will be lost.
  - Added the required column `audioToken` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoToken` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `mode` on the `Token` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TokenMode" AS ENUM ('PRESENTER', 'VIEWER', 'GUEST');

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "token",
ADD COLUMN     "audioToken" TEXT NOT NULL,
ADD COLUMN     "videoToken" TEXT NOT NULL,
DROP COLUMN "mode",
ADD COLUMN     "mode" "TokenMode" NOT NULL;
