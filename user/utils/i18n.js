import i18next from 'i18next'
import Backend from 'i18next-node-fs-backend'
import path from 'path'
import i18nextMiddleware from 'i18next-http-middleware'

// to avoid pkg module not found error use
// const i18nextMiddleware = require('i18next-http-middleware/cjs/index.js')

/**
 * internalization
 */
export const availableLang = ['en', 'fr']

i18next
  .use(i18nextMiddleware.LanguageDetector)
  .use(Backend)
  .init(
    {
      backend: {
        loadPath: path.join(process.cwd(), 'locales/{{lng}}/{{ns}}.json')
      },
      detection: {
        order: ['cookies', 'header'],
        lookupCookie: 'i18next',
        lookupHeader: 'accept-language'
      },
      fallbackLng: 'fr',
      lowerCaseLng: true,
      preload: availableLang
    },
    function(err, t) {
      if (err) console.log('i18next error=>', err)
    }
  )
export default i18nextMiddleware.handle(i18next)
