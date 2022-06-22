import { IvsClient } from '@aws-sdk/client-ivs';

export const ivs = new IvsClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_ID || '',
    secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY || ''
  },
})