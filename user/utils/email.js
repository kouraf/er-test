import nodemailer from 'nodemailer'
import config from '../config'
import { bufferFile } from './files'
import path from 'path'
var sprintf = require('sprintf-js').sprintf

export const sendPasswordResetEmail = user => {
  const emailHtmlTemplate = bufferFile(
    '../templates/emails/reset_password_html',
    path
  )
  const emailTextTemplate = bufferFile(
    '../templates/emails/reset_password.txt',
    path
  )

  const params = {
    name: user.name,
    company: 'Easy relay',
    website: 'http://easy-relay.com/',
    product_name: 'Test #4',
    action_url: `${config.reset_password_url}?token=${user.reset_password_token}`
  }

  const text = sprintf(emailTextTemplate, params)
  const html = sprintf(emailHtmlTemplate, params)

  return sendEmail(user.email, 'Reset your password', text, html)
}

export const sendEmail = async (to, subject, text, html) => {
  /* 
  
   Generate test SMTP service account from ethereal.email
   Only needed if you don't have a real mail account for testing

  const account = await nodemailer.createTestAccount()
  const transporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user,
      pass: account.pass
    }
  })
  */

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.email.user, // generated ethereal user
      pass: config.email.password // generated ethereal password
    }
  })

  try {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: config.email.user, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html // html body
    })

    console.log('Message sent: %s', info.messageId)
    // Preview only available when sending through an Ethereal account
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))

    return info
  } catch (err) {
    console.error('Message sent error: %s', err)
    return Promise.reject(new Error('EMAIL_SEND_ERROR'))
  }
}
