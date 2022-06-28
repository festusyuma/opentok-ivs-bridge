import OpenTok from 'opentok';

const apiKey = process.env.OPENTK_API_KEY || ''
const apiSecret = process.env.OPENTK_SECRET || ''

console.log(apiKey)

export const opentok = new OpenTok(apiKey, apiSecret)