import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import Cors from 'cors'
import router from './app'

const app = express()

app.use(Cors())
app.use(bodyParser.json({ limit: '50mb' }))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: false, limit: '50mb' }))
app.use(router) // routes

declare global {
  interface BigInt {
    toJSON: () => string;
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};

const PORT = Number(process.env.PORT) || 3000
const HOST = process.env.HOST || 'localhost'

app.listen(PORT,  HOST, () => {
  console.info(`Listening on port ${HOST}:${PORT}`)
})
