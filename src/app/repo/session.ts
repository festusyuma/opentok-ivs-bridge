import {repo} from "./index";
import {prisma} from "../modules";
import {LiveSession} from "../types";

export const saveSession = (data: LiveSession): Promise<LiveSession | null> =>
  repo(() => prisma.session.create({
    data,
  }))

export const findSessionByKey = (key: string): Promise<LiveSession | null>  =>
  repo(() => prisma.session.findFirst({
    where: { key },
    include: {
      broadcast: true
    }
  }))