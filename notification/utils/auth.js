import config from '../config'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { body, validationResult, checkSchema } from 'express-validator'
import axios from 'axios'
import envConfig from '../config'

export const generateToken = (user, secret = config.jwt.secret) => {
  return jwt.sign(
    {
      id: user.id,
      roles: user.roles,
      email: user.email,
      name: user.name
    },
    secret,
    {
      expiresIn: config.jwt.expiration
    }
  )
}

export const verifyToken = (token, secret = config.jwt.secret) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

export const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash)
}

export const paswwordHash = password => {
  return bcrypt.hash(password, 10)
}

export const validateCredentials = () => {
  return [
    body('password', 'password is required (length > 8)').isLength({ min: 8 }),
    body('email', 'Invalid email').isEmail()
  ]
}

export const authorizationHeader = () => {
  return checkSchema({
    Authorization: {
      in: ['headers'],
      customSanitizer: {
        options: value => {
          return value && value.startsWith('Bearer ')
            ? value.split('Bearer ')[1].trim()
            : value
        }
      },
      isJWT: true
    }
  })
}

// has one role only or all
export const addUserToRequest = roles => {
  return async (req, res, next) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        // console.log('validator errors', errors)
        res.status(401).json({ code: 401, message: errors.array() })
        return
      }

      // the hearder was modified by validator middleware
      const token = req.headers.authorization

      // token validation pass but recheck user in database
      const {
        data: { data: user }
      } = await axios.get(envConfig.getUserURI, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (!user) {
        return res.status(401).send({ code: 401, message: 'Unauthorized' })
      }

      req.user = user
      next()
    } catch (error) {
      console.log('error : ', error)
      res.status(401).json({ code: 401, error })
    }
  }
}
