import {repo} from "./index";
import {LiveToken} from "../types";
import {prisma} from "../modules";

export const saveToken = (data: LiveToken, key: string): Promise<LiveToken | null> =>
  repo(() => prisma.token.create({
    data: {
      ...data,
      session: {
        connect: {key}
      }
    },
    include: {
      session: {
        include: {
          broadcast: true
        }
      }
    }
  }))

export const findTokenByKeyAndUsername = (key: string, username: string): Promise<LiveToken | null> =>
  repo(() => prisma.token.findFirst({
    where: {
      username,
      session: {key}
    },
    include: {
      session: {
        include: {
          broadcast: true
        }
      }
    }
  }))