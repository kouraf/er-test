require('dotenv').config()
const env = process.env.NODE_ENV || 'development'
const {
  EMAIL_USER,
  EMAIL_PASSWORD,
  JWT_EXPIRATION,
  JWT_SECRET,
  PORT,
  EMAIL_HOST,
  EMAIL_PORT,
  RESET_PASSWORD_URL,
  GEOCODER,
  GEOCODER_API_KEY,
  VONAGE_API_KEY,
  VONAGE_API_SECRET
} = process.env

const envConfig = {
  env,
  geo: {
    GEOCODER,
    GEOCODER_API_KEY
  },
  server: {
    port: PORT,
    host: 'localhost',
    https: false
  },
  reset_password_url: RESET_PASSWORD_URL,
  reset_password_expires: 86400000,
  email: {
    user: EMAIL_USER,
    password: EMAIL_PASSWORD,
    host: EMAIL_HOST,
    port: EMAIL_PORT
  },
  jwt: {
    secret: JWT_SECRET,
    expiration: JWT_EXPIRATION
  },
  vonage: {
    key: VONAGE_API_KEY,
    secret: VONAGE_API_SECRET
  }
}

// console.log('config ===>', envConfig)

export default envConfig
