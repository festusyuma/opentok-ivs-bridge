import {LiveSession} from "./session";

export interface LiveBroadcast {
  id?: bigint
  ivsChannel: string
  broadcastChannel?: string | null
  broadcastUrl: string
  status?: BroadcastStatus
  session?: LiveSession
}

export enum BroadcastStatus {
  PENDING = "PENDING",
  LIVE = "LIVE",
  ENDED = "ENDED"
}

export interface StartBroadcastParams {
  id: string
  sessionId: string
  serverUrl: string
  streamName: string
}

export interface IvsParamsResponse {
  injestUrl?: string
  injestKey?: string
}