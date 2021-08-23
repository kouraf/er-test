// after all 'require' statements

import i18n from './utils/i18n'
import createError from 'http-errors'
import express from 'express'
import { authorizationHeader, addUserToRequest } from './utils/auth'
import logger from 'morgan'
import notificationRouter from './resources/notification/notification.router'
import cors from 'cors'
import { create } from 'venom-bot'
import envConfig from './config'
const Vonage = require('@vonage/server-sdk')

export const vonage = new Vonage({
  apiKey: envConfig.vonage.key,
  apiSecret: envConfig.vonage.secret
})

let client = null
export const app = express()
/**
 * internalization
 */
app.use(i18n)

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(authorizationHeader(), addUserToRequest())
app.use(async (req, res, next) => {
  try {
    if (!client) client = await create()
  } catch (error) {
    console.log('error :', error)
  }
  req.whatsapp = client
  next()
})

// Routers
app.use('/', notificationRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log('catch 404 and forward to error handler path =>', req.path)
  next(createError(404, 404))
})

// error handler
app.use(function(err, req, res, next) {
  console.log('error handler', err)
  if (err instanceof SyntaxError) {
    res.status(422).json({ code: 422, message: 'Please check your inputs' })
  } else {
    // send error
    res.status(err.status || 500)
    res.send({
      code: err.code || 500,
      message: err.message
    })
  }
})
