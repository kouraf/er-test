import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

export const options = { timestamps: true }
export const ROLES = {
  superAdmin: 'SUPERADMIN',
  admin: 'ADMIN',
  seller: 'SELLER',
  buyer: 'BUYER',
  techSupport: 'TECHSUPPORT',
  deliverer: 'DELIVERER'
}
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: false
    },
    whatsapp: {
      type: String,
      required: false
    },
    roles: {
      type: [String],
      enum: Object.values(ROLES)
    },
    contacts: [
      {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    reset_password_token: {
      type: String,
      required: false
    },
    reset_password_expires: {
      type: mongoose.Schema.Types.Date,
      required: false
    }
  },
  options
)

userSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next()
  }
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) {
      return next(err)
    }
    this.password = hash
    next()
  })
})

userSchema.index({ email: 'text' })

export const User = mongoose.model('User', userSchema)
