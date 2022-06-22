import express, {Response} from "express";
import {GenerateTokenSchema} from "./schema";
import {endBroadcast, initBroadcast, initSession, initToken, startBroadcast} from "./service";
import {unknownError} from "../constants";
const router = express.Router()

const callBack = async (res: Response, func: () => Promise<any>) => {
  try {
    await func()
  } catch (e) {
    return res.status(500).json({ message: unknownError })
  }
}

// init stream
router.post(
  '/stream/:key',
  (req, res) =>
    callBack(res, async () => {
      const {key} = req.params
      const session = await initSession(key)
      if (!session) return res.status(500).json({message: unknownError})

      const broadcast = await initBroadcast(session.key)
      if (!broadcast) return res.status(500).json({message: unknownError})
      delete broadcast.session

      return res.status(200).json({ data: { ...session, broadcast} })
    })
)

// generate stream token
router.post(
  '/token',
  (req, res) =>
    callBack(res, async () => {
      const {error, value: data} = GenerateTokenSchema.validate(req.body)
      if (error || !data)
        return res.status(400)
          .json({ message: error?.message })

      const token = await initToken(data)
      if (!token) return res.status(500).json({message: unknownError})

      return res.status(200).json({ data: token })
    })
)

// start stream broadcast
router.patch(
  '/stream/:key/broadcast',
  (req, res) =>
    callBack(res, async () => {
      const {key} = req.params
      const broadcast = await startBroadcast(key)
      if (!broadcast) return res.status(500).json({message: unknownError})

      return res.status(200).json({ data: broadcast })
    })
)

// end stream broadcast
router.delete(
  '/stream/:key/broadcast',
  (req, res) =>
    callBack(res, async () => {
      const {key} = req.params
      const stopped = await endBroadcast(key)

      return res.status(200).json({ data: stopped })
    })
)

export default router