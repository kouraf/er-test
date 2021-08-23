import { body, validationResult, param } from 'express-validator'
import cuid from 'cuid'
import { ROLES } from '../resources/user/user.model'

export const i18ErrorMsg = validationChain => {
  return validationChain.map(validation => {
    return validation.withMessage((_, { req, path }) => {
      return req.t('validator.' + path.replace(/\[(.*?)\]/gm, '[]'))
    })
  })
}

export const validateId = () => {
  return i18ErrorMsg([param('id').isMongoId()])
}

export const validateGeo = () => {
  return [
    body('submit', 'tweet content is required')
      .exists()
      .isLength({ min: 1 })
  ]
}

export const validatePassword = () => {
  return i18ErrorMsg([
    body('newPassword').isLength({
      min: 8
    }),
    body('currentPassword').isLength({
      min: 8
    })
  ])
}

export const validateRequestPasswordReset = () => {
  return i18ErrorMsg([body('email').isEmail()])
}

export const validateResetPassword = () => {
  return i18ErrorMsg([
    body('newPassword').isLength({
      min: 8
    }),
    body('token')
      .isLength({
        min: 8
      })
      .custom(input => {
        return cuid.isCuid(input)
      })
  ])
}

export const validate = (req, res) => {
  return new Promise((resolve, reject) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log('validate', errors)
      res.status(422).json({ code: 422, message: errors.array() })
    } else resolve(true)
  })
}

export const validateArrayOfMongoIds = () => {
  return i18ErrorMsg([
    body('sources').isArray({ min: 1 }),
    body('sources.*').isMongoId()
  ])
}

export const validateIsString = field =>
  i18ErrorMsg([
    body(field)
      .trim()
      .isString()
      .notEmpty()
  ])

export const validateUser = () =>
  i18ErrorMsg([
    body('name')
      .trim()
      .isString()
      .notEmpty(),
    body('email')
      .isEmail()
      .notEmpty(),
    body('password')
      .isString()
      .notEmpty(),
    body('phone')
      .isString()
      .isLength({ min: 12, max: 12 })
      .custom(phone => phone.startsWith('213'))
      .optional(),
    body('whatsapp')
      .isString()
      .isLength({ min: 12, max: 12 })
      .custom(phone => phone.startsWith('213'))
      .optional(),
    body('roles').isArray({ min: 1 }),
    body('roles.*')
      .trim()
      .isString()
      .notEmpty()
      .isIn(Object.values(ROLES)),
    body('contacts')
      .isArray()
      .optional(),
    body('contacts.*')
      .isMongoId()
      .notEmpty()
  ])
