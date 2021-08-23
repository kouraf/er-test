import config from '../config'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { User } from '../resources/user/user.model'
import { body, validationResult, checkSchema } from 'express-validator'

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

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      res.status(400).json({ code: 400, message: errors.array() })
    } else {
      const { email, password } = req.body
      const user = await User.findOne({ email })
      if (!user) {
        res.status(401).send({ code: 401, message: 'Unauthorized' })
      } else {
        const match = await comparePassword(password, user.password)
        if (match) {
          const token = generateToken(user)
          const decoded = jwt.decode(token, { complete: true })
          res.status(201).send({
            id_token: token,
            timeStamp: Date.now(),
            id_token_expires_in: new Date(decoded.payload.exp * 1000)
          })
        } else {
          res.status(401).send({ code: 401, message: 'Unauthorized' })
        }
      }
    }
  } catch (err) {
    next(err)
  }
}
// has one role only or all
export const hasRole = roles => {
  return async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      // console.log('validator errors', errors)
      res.status(401).json({ code: 401, message: errors.array() })
      return
    }

    // the hearder was modified by validator middleware
    const token = req.headers.authorization
    let payload
    try {
      payload = await verifyToken(token)
    } catch (e) {
      // console.log('verifyToken error', e)
      return res.status(401).send({ code: 401, message: 'Unauthorized' })
    }
    // token validation pass but recheck user in database

    const user = await User.findById(payload.id)
      .select('-createdAt -updatedAt -__v')
      .lean()
      .exec()

    if (!user) {
      return res.status(401).send({ code: 401, message: 'Unauthorized' })
    }

    // check permission
    let hasPermission = false
    if (user.roles) {
      user.roles.forEach(role => {
        if (roles.includes(role)) {
          hasPermission = true
        }
      })
    }

    if (!hasPermission) {
      return res.status(403).send({ code: 403, message: 'Forbidden' })
    }
    req.user = user
    next()
  }
}
