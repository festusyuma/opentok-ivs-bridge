import {initBroadcast, service} from "./index";
import {opentok} from "../modules";
import {LiveSession, MediaMode} from "../types";
import {findSessionByKey, saveSession} from "../repo";

export const initSession = (key: string): Promise<LiveSession> =>
  service(async () => {
    let session = await findSessionByKey(key)
    if (!session) {
      const videoChannel = await createSession(MediaMode.ROUTED)
      const audioChannel = await createSession(MediaMode.RELAYED)
      session = await saveSession({key, videoChannel, audioChannel})
    }

    return session
  })

export const createSession = (mode: MediaMode): Promise<string> =>
  new Promise((resolve, reject) => {
    opentok.createSession({
      mediaMode: mode
    }, (e, session) => {
      if (e) reject(e)
      else if (session) resolve(session.sessionId)
      else reject('error creating session')
    })
  })
