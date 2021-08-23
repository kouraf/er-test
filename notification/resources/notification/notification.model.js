import mongoose from 'mongoose'

export const options = { timestamps: true }

export const NOTIFICATION_TYPES = {
  SMS: 'SMS',
  WHATSAPP: 'WHATSAPP',
  EMAIL: 'EMAIL'
}

const notificationSchema = mongoose.Schema(
  {
    from: {
      type: String,
      required: true
    },
    to: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(NOTIFICATION_TYPES)
    },
    message: {
      type: String,
      required: true
    }
  },
  options
)

export const Notification = mongoose.model('Notification', notificationSchema)
