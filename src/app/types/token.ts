export interface LiveToken {
  id?: bigint
  videoToken: string
  audioToken: string
  username: string
  mode: TokenMode
}

export enum TokenMode {
  PRESENTER = "PRESENTER",
  VIEWER = "VIEWER",
  GUEST = "GUEST"
}

export interface GenerateTokenRequest {
  key: string
  data: any
  username: string
  mode: TokenMode
}