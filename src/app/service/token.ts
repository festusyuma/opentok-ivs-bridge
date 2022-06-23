import {DateTime} from "luxon"
import jwt from "jsonwebtoken"
import {service} from "./index";
import {GenerateTokenRequest, LiveToken, TokenMode} from "../types";
import {opentok} from "../modules";
import {findSessionByKey, findTokenByKeyAndUsername, saveToken} from "../repo";
import {initTokenError, invalidKeyError, noBroadcastError} from "../../constants";
import fs from "fs";

export const initToken = (
  {key, username, mode, data}: GenerateTokenRequest
): Promise<LiveToken> =>
  service(async () => {
    let token = await findTokenByKeyAndUsername(key, username)
    if (token) return token

    const session = await findSessionByKey(key)
    if (!session) throw new Error(invalidKeyError)

    const {audioChannel, videoChannel, broadcast} = session
    if (!broadcast) throw new Error(noBroadcastError)

    const audioToken = generateOpentokToken(audioChannel, mode, data)
    const videoToken =
      mode === TokenMode.PRESENTER
        ? generateOpentokToken(videoChannel, mode, data)
        : generateIvsToken(broadcast.ivsChannel)

    token = await saveToken(
      {audioToken, videoToken, username, mode},
      key
    )

    if (!token) throw new Error(initTokenError)
    return token
  })

export const generateIvsToken = (channel: string): string => {
  const privateKey = fs.readFileSync('./private-key.pem')
  return jwt.sign(
    {
      "aws:channel-arn": channel,
      "aws:access-control-allow-origin": "*",
      "exp": DateTime.now().plus({hours: 2}).valueOf()
    },
    privateKey,
    {algorithm: "ES384"}
  )
}

export const generateOpentokToken = (
  sessionId: string,
  mode: TokenMode,
  data: any
): string => opentok.generateToken(sessionId, {
  role: 'publisher',
  data: JSON.stringify(data),
  expireTime: DateTime.now().plus({days: 7}).valueOf(),
  initialLayoutClassList: ["focus"],
})