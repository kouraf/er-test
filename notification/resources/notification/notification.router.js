import express from 'express'
import {
  validateArrayOfMongoIds,
  validateMessage
} from '../../utils/validation'
import notifControllers from './notification.controllers'

const router = express.Router()

router.post(
  '/whatsapp',
  validateArrayOfMongoIds('to'),
  validateMessage(),
  notifControllers.whatsapp
)
router.post(
  '/email',
  validateArrayOfMongoIds('to'),
  validateMessage(),
  notifControllers.email
)
router.post(
  '/sms',
  validateArrayOfMongoIds('to'),
  validateMessage(),
  notifControllers.sms
)

export default router
