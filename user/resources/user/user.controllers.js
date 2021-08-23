import { User } from './user.model'
import mongoose from 'mongoose'
import { comparePassword, paswwordHash, verifyToken } from '../../utils/auth'
import { sendPasswordResetEmail } from '../../utils/email'
import config from '../../config'
import { validate } from '../../utils/validation'
import cuid from 'cuid'
const create = (req, res) => {
  return validate(req, res).then(async () =>
    User.create(req.body)
      .then(data => {
        res.status(201).send({ code: 201, data })
      })
      .catch(err => {
        console.log('create user err', err)
        if (err instanceof mongoose.Error) {
          res.status(400).send({ code: 400, message: `${err.message}` })
          return
        }
        res.status(500).send({ code: 500, message: 'internal error' })
      })
  )
}

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const email = req.user.email
  console.log('create req.user', req.user)
  console.log('email', email)
  return validate(req, res)
    .then(isValid => {
      if (isValid === true) {
        return comparePassword(currentPassword, req.user.password)
      }
    })
    .then(match => {
      if (match) {
        return paswwordHash(newPassword)
      } else {
        return Promise.reject(new Error('PASSWORD_MISMATCH'))
      }
    })
    .then(hash => {
      return User.updateOne(
        { _id: req.user._id },
        { password: hash },
        { new: true }
      )
        .lean()
        .exec()
    })
    .then(doc => {
      if (!doc) {
        return Promise.reject(new Error('INTERNAL_ERROR'))
      }
      console.log('user password updated', doc)
      return res
        .status(200)
        .json({ code: 201, message: 'Password updated with success' })
    })
    .catch(e => {
      console.error(e)
      if (e.message === 'PASSWORD_MISMATCH')
        return res.status(403).json({ code: 403, message: 'Password Mismatch' })

      return res.status(500).json({ code: 500, message: 'INTERNAL_ERROR' })
    })
}

const requestPasswordReset = async (req, res) => {
  const { email } = req.body
  return validate(req, res)
    .then(isValid => {
      if (isValid === true) {
        return User.findOneAndUpdate(
          { email },
          {
            reset_password_token: cuid(),
            reset_password_expires: Date.now() + config.reset_password_expires
          },
          { new: true }
        )
          .lean()
          .exec()
      }
    })
    .then(user => {
      if (user && user.reset_password_token) {
        return sendPasswordResetEmail(user)
      }
      return Promise.reject(new Error('EMAIL_NOT_FOUND'))
    })
    .then(sentMessageInfo => {
      return res.status(200).json({
        code: 201,
        message: 'Request Accepted and confirmation email is sent'
      })
    })
    .catch(e => {
      console.error(e)
      if (e.message === 'EMAIL_NOT_FOUND')
        return res.status(404).json({ code: 404, message: 'EMAIL_NOT_FOUND' })

      if (e.message === 'EMAIL_SEND_ERROR')
        return res.status(500).json({ code: 404, message: 'EMAIL_SEND_ERROR' })

      if (e.message === 'NOT_YET_IMPLEMENTED')
        return res
          .status(501)
          .json({ code: 501, message: 'NOT_YET_IMPLEMENTED' })

      return res.status(500).json({ code: 500, message: 'INTERNAL_ERROR' })
    })
}

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body
  return validate(req, res)
    .then(isValid => {
      if (isValid === true) {
        return paswwordHash(newPassword)
      }
    })
    .then(hash => {
      return User.findOneAndUpdate(
        {
          reset_password_token: token,
          reset_password_expires: {
            $gt: Date.now()
          }
        },
        {
          password: hash,
          $unset: { reset_password_token: 1, reset_password_expires: 1 }
        },
        { new: true }
      )
        .lean()
        .exec()
    })
    .then(doc => {
      console.log('user updated', doc)

      if (!doc) {
        return res.status(404).json({ code: 404, message: 'invalid token' })
      }
      return res
        .status(200)
        .json({ code: 201, message: 'Password updated with success' })
    })
    .catch(e => {
      console.error(e)
      return res.status(500).json({ code: 500, message: 'INTERNAL_ERROR' })
    })
}

const getUser = async (req, res) => {
  try {
    const token = req.headers.authorization
    const payload = await verifyToken(token)
    const user = await User.findById(payload.id)
      .select('-createdAt -updatedAt -__v -password')
      .populate('contacts', '-createdAt -updatedAt -__v -password')
      .lean()
      .exec()
    return res.status(200).send({ code: 200, data: user })
  } catch (e) {
    console.log('error : ', e)
    return res.status(500).send({ code: 401, message: 'Internal error' })
  }
}

export default {
  create,
  changePassword,
  resetPassword,
  requestPasswordReset,
  getUser
}
