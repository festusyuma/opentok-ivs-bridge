import {LiveBroadcast} from "./broadcast";

export interface LiveSession {
  id?: bigint
  key: string
  videoChannel: string
  audioChannel: string
  broadcast?: LiveBroadcast
}