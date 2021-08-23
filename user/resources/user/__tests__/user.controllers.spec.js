import controllers from '../user.controllers'
import { isFunction } from 'lodash'
describe('User Controllers', () => {
  test('Has create methode', () => {
    expect(isFunction(controllers.create)).toBeTruthy()
  })

  test('Has changePassword methode', () => {
    expect(isFunction(controllers.changePassword)).toBeTruthy()
  })

  test('Has requestPasswordReset methode', () => {
    expect(isFunction(controllers.requestPasswordReset)).toBeTruthy()
  })

  test('Has resetPassword methode', () => {
    expect(isFunction(controllers.resetPassword)).toBeTruthy()
  })
})
