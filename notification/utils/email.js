import nodemailer from 'nodemailer'
import config from '../config'

export const sendEmail = async (to, subject, text, html) => {
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
