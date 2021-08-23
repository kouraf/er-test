import mongoose from 'mongoose'
require('dotenv').config()

const {
  AUTH_SOURCE,
  MONGO_HOSTNAME,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_PORT,
  MONGO_DB
} = process.env

export const options = {
  useNewUrlParser: true,
  connectTimeoutMS: 10000,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}

export const dbUrl = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=${AUTH_SOURCE ||
  MONGO_DB}`
// export const dbUrl = `mongodb://localhost:${MONGO_PORT}/${MONGO_DB}?authSource=${AUTH_SOURCE ||
//   MONGO_DB}`

export const connect = (url = dbUrl, opts) => {
  console.log('connect', url)
  return mongoose.connect(url, {
    ...opts,
    ...options
  })
}
