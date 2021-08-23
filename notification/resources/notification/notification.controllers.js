import { sendEmail } from '../../utils/email'
import { bufferFile } from '../../utils/files'
import path from 'path'
import { validate } from '../../utils/validation'
import { vonage } from '../../app'
import { Notification, NOTIFICATION_TYPES } from './notification.model'
const sprintf = require('sprintf-js').sprintf

const whatsapp = async (req, res) => {
  try {
    await validate(req, res)
    const { to, message } = req.body

    if (
      !to?.every(t => {
        const contact = req.user.contacts.find(usr => usr._id === t)
        return !!contact && contact?.whatsapp
      })
    )
      return res
        .status(403)
        .send({ code: 403, message: "you can't send this email" })

    await Promise.all(
      to.map(async contact => {
        const receiver = req.user.contacts.find(c => c._id === contact)
        const msgTemplate = bufferFile(
          `./../templates/message_${message}.txt`,
          path
        )
        const acknowledgementTemplate = bufferFile(
          './../templates/acknowledgement.txt',
          path
        )
        const params = {
          sender_name: req.user.name,
          receiver_name: receiver.name,
          type: 'whatsapp message'
        }

        const msgText = sprintf(msgTemplate, params)
        const acknowledgementText = sprintf(acknowledgementTemplate, params)

        await req.whatsapp
          .sendText(`${receiver.whatsapp}@c.us`, msgText)
          .then(() => {
            Notification.create({
              from: req.user._id,
              to: receiver._id,
              type: NOTIFICATION_TYPES.WHATSAPP,
              message: msgText
            })
            sendEmail(
              req.user.email,
              'Acknowledgement ',
              acknowledgementText,
              acknowledgementText
            )
          })
          .catch(error => {
            console.error('Error when sending: ', error)
          })
      })
    )

    return res.status(200).send({ code: 200 })
  } catch (error) {
    console.log('error : ', error)
    return res.status(500).send({ code: 500 })
  }
}
const email = async (req, res) => {
  try {
    await validate(req, res)
    const { to, message } = req.body

    if (!to?.every(t => !!req.user.contacts.find(contact => contact._id === t)))
      return res
        .status(400)
        .send({ code: 400, message: "you can't send this email" })

    await Promise.all(
      to.map(async contact => {
        const receiver = req.user.contacts.find(c => c._id === contact)
        const msgTemplate = bufferFile(
          `./../templates/message_${message}.txt`,
          path
        )
        const acknowledgementTemplate = bufferFile(
          './../templates/acknowledgement.txt',
          path
        )
        const params = {
          sender_name: req.user.name,
          receiver_name: receiver.name,
          type: 'email'
        }

        const msgText = sprintf(msgTemplate, params)
        const acknowledgementText = sprintf(acknowledgementTemplate, params)

        await sendEmail(
          receiver.email,
          'Easy Relay Notification',
          msgText,
          msgText
        )
        await Notification.create({
          from: req.user._id,
          to: receiver._id,
          type: NOTIFICATION_TYPES.EMAIL,
          message: msgText
        })
        await sendEmail(
          req.user.email,
          'Acknowledgement ',
          acknowledgementText,
          acknowledgementText
        )
      })
    )

    return res.status(200).send({ code: 200 })
  } catch (error) {
    console.log('error : ', error)
    return res.status(500).send({ code: 500 })
  }
}
const sms = async (req, res) => {
  try {
    await validate(req, res)
    const { to, message } = req.body

    if (
      !to?.every(t => {
        const contact = req.user.contacts.find(usr => usr._id === t)
        return !!contact && contact?.phone
      })
    )
      return res
        .status(400)
        .send({ code: 400, message: "you can't send this email" })

    await Promise.all(
      to.map(async contact => {
        const receiver = req.user.contacts.find(c => c._id === contact)
        const msgTemplate = bufferFile(
          `./../templates/message_${message}.txt`,
          path
        )
        const acknowledgementTemplate = bufferFile(
          './../templates/acknowledgement.txt',
          path
        )
        const params = {
          sender_name: req.user.name,
          receiver_name: receiver.name,
          type: 'SMS'
        }

        const msgText = sprintf(msgTemplate, params)
        const acknowledgementText = sprintf(acknowledgementTemplate, params)

        await vonage.message.sendSms(
          req.user.name,
          receiver.phone,
          msgText,
          (err, responseData) => {
            if (err) {
              console.log(err)
            } else {
              if (responseData.messages[0].status === '0') {
                Notification.create({
                  from: req.user._id,
                  to: receiver._id,
                  type: NOTIFICATION_TYPES.SMS,
                  message: msgText
                })
                sendEmail(
                  req.user.email,
                  'Acknowledgement ',
                  acknowledgementText,
                  acknowledgementText
                )
              } else {
                console.log(
                  `Message failed with error: ${responseData.messages[0]['error-text']}`
                )
              }
            }
          }
        )
      })
    )

    return res.status(200).send({ code: 200 })
  } catch (error) {
    console.log('error : ', error)
    return res.status(500).send({ code: 500 })
  }
}
export default {
  whatsapp,
  email,
  sms
}
