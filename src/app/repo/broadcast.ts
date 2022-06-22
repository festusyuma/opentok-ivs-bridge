import {repo} from "./index";
import {prisma} from "../modules";
import {LiveBroadcast} from "../types";

export const saveBroadcast = (data: LiveBroadcast, key: string): Promise<LiveBroadcast | null> =>
  repo(() => prisma.broadcast.create({
    data: {
      ...data,
      session: {
        connect: {key}
      }
    },
    include: {
      session: true
    }
  }))

export const findBroadcastByKey = (key: string): Promise<LiveBroadcast | null> =>
  repo(() => prisma.broadcast.findFirst({
    where: {
      session: {
        key,
      }
    },
    include: {
      session: true
    }
  }))

export const updateBroadcast = (data: LiveBroadcast) =>
  repo(() => prisma.broadcast.update({
    data: {
      broadcastChannel: data.broadcastChannel,
      status: data.status
    },
    where: { id: data.id },
    include: {
      session: true
    }
  }))