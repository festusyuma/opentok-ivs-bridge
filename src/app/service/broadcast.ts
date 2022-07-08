import {service} from "./index"
import {ivs, opentok} from "../modules"
import {
  CreateChannelCommand,
  CreateChannelResponse,
  CreateStreamKeyCommand,
  GetChannelCommand,
  GetStreamKeyCommand,
  ListStreamKeysCommand,
  StreamKey,
} from '@aws-sdk/client-ivs'
import {findBroadcastByKey, saveBroadcast, updateBroadcast} from "../repo";
import {BroadcastStatus, IvsParamsResponse, LiveBroadcast, StartBroadcastParams} from "../types";
import {defaultResolution, errorFetchingIvsKey, initBroadcastError, invalidKeyError} from "../../constants";
import {Broadcast} from "opentok";

export const initBroadcast = (key: string): Promise<LiveBroadcast> =>
  service(async () => {
    let liveBroadcast = await findBroadcastByKey(key)
    if (liveBroadcast) return liveBroadcast

    const {channel} = await createIvsChannel(key)
    if (!channel || !channel.arn || !channel.playbackUrl)
      throw new Error(initBroadcastError)

    liveBroadcast = await saveBroadcast(
      {
        ivsChannel: channel.arn,
        broadcastUrl: channel.playbackUrl
      },
      key
    )

    if (!liveBroadcast)
      throw new Error(initBroadcastError)

    return liveBroadcast
  })

export const startBroadcast = (key: string): Promise<LiveBroadcast> =>
  service(async () => {
    let liveBroadcast = await findBroadcastByKey(key)
    if (!liveBroadcast || !liveBroadcast.session) throw new Error(invalidKeyError)

    let broadcast: Broadcast | undefined
    if (liveBroadcast.broadcastChannel) {
      broadcast = await fetchBroadcast(liveBroadcast.broadcastChannel)
    }

    if (!broadcast || !broadcast.broadcastUrls || broadcast.status === 'stopped') {
      const {injestUrl, injestKey} = await fetchIvsParams(liveBroadcast.ivsChannel)
      if (!injestUrl || !injestKey) throw new Error(errorFetchingIvsKey)

      broadcast = await createBroadcast({
        id: key,
        sessionId: liveBroadcast.session.videoChannel,
        serverUrl: `rtmps://${injestUrl}:443/app/`,
        streamName: `${injestKey}`,
      })

      liveBroadcast.broadcastChannel = broadcast.id
      liveBroadcast.status = BroadcastStatus.LIVE
      liveBroadcast =  await updateBroadcast(liveBroadcast)
    }

    return liveBroadcast
  })

export const endBroadcast = (key: string): Promise<boolean> =>
  service(async () => {
    let liveBroadcast = await findBroadcastByKey(key)
    if (!liveBroadcast || !liveBroadcast.session) throw new Error(invalidKeyError)
    if (!liveBroadcast.broadcastChannel) return true

    const broadcast = await fetchBroadcast(liveBroadcast.broadcastChannel)
    if (!broadcast || !broadcast.broadcastUrls || broadcast.status === 'stopped')
      return true

    liveBroadcast.broadcastChannel = null
    liveBroadcast.status = BroadcastStatus.ENDED

    const stopped = await (new Promise<boolean>((resolve, reject) => {
      broadcast.stop((e, broadcast) => {
        if (e) reject(e)
        else resolve(broadcast.status === 'stopped')
      })
    }))

    await updateBroadcast(liveBroadcast)
    return stopped
  })

export const createBroadcast = ({id, sessionId, serverUrl, streamName}: StartBroadcastParams): Promise<Broadcast> =>
  new Promise((resolve, reject) => {
    opentok.startBroadcast(sessionId, {
      // @ts-ignore
      resolution: defaultResolution,
      outputs: {
        rtmp: [{
          id,
          serverUrl,
          streamName
        }]
      },
      layout: {
        type: "bestFit",
        // @ts-ignore
        screenshareType: "pip"
      }
    }, (error, broadcast) => {
      if (error) reject(error)
      else resolve(broadcast)
    })
  })

export const fetchBroadcast = (id: string): Promise<Broadcast | undefined> =>
  new Promise((resolve, reject) => {
    opentok.getBroadcast(id, (e, broadcast) => {
      if (e) reject(e)
      else resolve(broadcast)
    })
  })

export const createIvsChannel = (name: string): Promise<CreateChannelResponse> =>
  service(async () => {
    const command = new CreateChannelCommand({
      name,
    })

    return await ivs.send(command)
  })

export const fetchIvsParams = (arn: string): Promise<IvsParamsResponse> =>
  service(async () => {
    const command = new GetChannelCommand({arn})
    const listKeyCommand = new ListStreamKeysCommand({channelArn: arn})

    const channelRes = await ivs.send(command)
    const listKeyRes = await ivs.send(listKeyCommand)
    const keys = listKeyRes.streamKeys || []

    let streamKey: StreamKey | undefined
    if (keys.length) {
      const keyCommand = new GetStreamKeyCommand({arn: keys[0].arn})
      const keyRes = await ivs.send(keyCommand)
      streamKey = await keyRes.streamKey
    } else {
      const keyCommand = new CreateStreamKeyCommand({channelArn: arn})
      const keyRes = await ivs.send(keyCommand)
      streamKey = await keyRes.streamKey
    }

    if (!channelRes.channel || !streamKey)
      throw new Error(errorFetchingIvsKey)

    return {
      injestUrl: channelRes.channel.ingestEndpoint,
      injestKey: streamKey.value
    }
  })