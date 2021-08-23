import express from 'express'
import userControllers from './user.controllers'
import { authorizationHeader, hasRole } from '../../utils/auth'
import {
  validatePassword,
  validateResetPassword,
  validateRequestPasswordReset,
  validateUser
} from '../../utils/validation'
import { ROLES } from './user.model'

const router = express.Router()

router.post(
  '/',
  [authorizationHeader(), hasRole([ROLES.superAdmin]), validateUser()],
  userControllers.create
)

router.get(
  '/',
  [authorizationHeader(), hasRole(Object.values(ROLES))],
  userControllers.getUser
)

router.put(
  '/password',
  [authorizationHeader(), hasRole(Object.values(ROLES)), validatePassword()],
  userControllers.changePassword
)

router.post(
  '/password',
  [validateRequestPasswordReset()],
  userControllers.requestPasswordReset
)

router.post(
  '/password/reset',
  [validateResetPassword()],
  userControllers.resetPassword
)

export default router
