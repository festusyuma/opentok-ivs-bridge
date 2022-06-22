-- CreateEnum
CREATE TYPE "BroadcastStatus" AS ENUM ('PENDING', 'LIVE', 'ENDED');

-- AlterTable
ALTER TABLE "Broadcast" ADD COLUMN     "status" "BroadcastStatus" NOT NULL DEFAULT E'PENDING',
ALTER COLUMN "broadcastChannel" DROP NOT NULL;
