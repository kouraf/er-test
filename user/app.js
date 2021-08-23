// after all 'require' statements

import i18n from './utils/i18n'
import createError from 'http-errors'
import express from 'express'
import { validateCredentials, login } from './utils/auth'
import logger from 'morgan'
import userRouter from './resources/user/user.router'
import cors from 'cors'

export const app = express()
/**
 * internalization
 */
app.use(i18n)

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routers
app.post('/auth', validateCredentials(), login)

app.use('/users', userRouter)

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
